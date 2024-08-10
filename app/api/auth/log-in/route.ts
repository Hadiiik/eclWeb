import { sanitizeInput } from "@/helpers/sanitizeInput";
import { wait } from "@/helpers/wait";
import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { NextRequest, NextResponse } from "next/server";
type logInData = {
    email:string,
    passwordHash:string
  }
export async function POST(req:NextRequest){
    const rateLimitResponse = await rateLimiterMiddleware(req);
    if (rateLimitResponse) return rateLimitResponse;
    const req_body = await req.json();
    const email = sanitizeInput(req_body.email);
    const passwordHash = sanitizeInput(req_body.passwordHash);
    const {data,error} = await supabase.
    from('users')
    .select('passwordHash')
    .eq('email',email)
    .single();
    if(error){
        await wait(3000);
        return NextResponse.json({status:500,message:"serever error"});
    }
    const originalPasswordHash = data?.passwordHash;
    if(originalPasswordHash!==passwordHash){
        await wait(3000);
        return NextResponse.json({status:500,message:"serever error"});
    }
    const token = btoa(email+passwordHash);
    const response = NextResponse.json({ status: 200, message: "ok" });
    response.cookies.set("sToken", token);
    await wait(3000)
    return response;

}
