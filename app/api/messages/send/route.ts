import { sanitizeInput } from "@/helpers/sanitizeInput";
import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { NextRequest, NextResponse } from "next/server";
type body = {
    email:string,
    title:string,
    message:string
}
function isBody(obj: any): obj is body {
    return typeof obj.email === 'string' &&
           typeof obj.title === 'string' &&
           typeof obj.message === 'string';
}

export async function POST(req:NextRequest){
    const rateLimitResponse = await rateLimiterMiddleware(req);
    if (rateLimitResponse) return rateLimitResponse;

    const req_body = await req.json()
    if(!isBody(req_body))
        return NextResponse.json({
            message: "not allowed",
        }, {
            status: 405,
        });
    // removing injections if there is 
    req_body.email = sanitizeInput(req_body.email);
    req_body.message = sanitizeInput(req_body.message);
    req_body.title = sanitizeInput(req_body.title);
    //upload message to supabase 
    const {data,error} = await supabase
    .from("messages")
    .insert(req_body)
    if(error)
        return NextResponse.json(
            {message:"message could not be sent "},{status:422}
            )

            
    return NextResponse.json(
        {message:"message sent sucseffuly"},{status:201}
        )
}