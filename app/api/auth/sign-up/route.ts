import { sanitizeInput } from "@/helpers/sanitizeInput";
import { wait } from "@/helpers/wait";
import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { NextRequest, NextResponse } from "next/server";

type signUpdata = {
    email: string,
    phoneNumber: string,
    passwordHash: string,
    category: string,
    area: string
};

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiterMiddleware(req);
    if (rateLimitResponse) return rateLimitResponse;
    const req_body: signUpdata = await req.json();
    if (!isSignUpData(req_body)) {
        return NextResponse.json({ status: 400, message: "bad format" });
    }
      // التحقق مما إذا كان البريد الإلكتروني أو رقم الهاتف موجودًا بالفعل
      const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${req_body.email},phoneNumber.eq.${req_body.phoneNumber}`);

  if (fetchError) {
      return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }

  if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ status: 401, message: "Email or phone number already in use" });
  }

    const token: string = TOKEN(req_body.email, req_body.passwordHash);
    const { data, error } = await supabase
        .from('users')
        .insert({
            "email": req_body.email,
            "phoneNumber": req_body.phoneNumber,
            "passwordHash": req_body.passwordHash,
            "category": req_body.category,
            "role": "user",
            "user_token": token
        });
    
    if (error) {
        await wait(3000);
        return NextResponse.json({ status: 400, message: "bad format" });
    }
    
    await wait(3000);
    const response = NextResponse.json({ status: 200, message: "ok" });
    response.cookies.set("sToken", token);
    return response;
}

// دالة للتحقق من صحة رقم الهاتف
function isPhoneNumberValid(phoneNumber: string): boolean {
    const phoneRegex = /^\+[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber))
        console.log("wrong number");
    return phoneRegex.test(phoneNumber);
}

function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        console.log("wrong gmail");
    return emailRegex.test(email);
}

function isSignUpData(data: any): data is signUpdata {
    if (typeof data !== 'object' || data === null) return false;

    const email = sanitizeInput(data.email);
    const phoneNumber = sanitizeInput(data.phoneNumber);
    const passwordHash = sanitizeInput(data.passwordHash);
    const category = sanitizeInput(data.category);

    return (
        typeof email === 'string' &&
        typeof phoneNumber === 'string' &&
        typeof passwordHash === 'string' &&
        typeof category === 'string' &&
        typeof data.area === 'string' &&
        isPhoneNumberValid(phoneNumber) &&
        isValidEmail(email)
    );
}

function TOKEN(str: string, passwordHash: string) {
    return btoa(str + passwordHash);
}

