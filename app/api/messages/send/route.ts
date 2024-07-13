import { supabase } from "@/lib/supabase";
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
    const req_body = await req.json()
    if(!isBody(req_body))
        return NextResponse.json({
            message: "not allowed",
        }, {
            status: 405,
        });
    //upload message to supabase 
    const {data,error} = await supabase
    .from("messages")
    .insert(req_body)
    if(data)
        return NextResponse.json(
    {message:"message sent sucseffuly"},{status:201}
    )
    return NextResponse.json(
        {message:"message could not be sent "},{status:422}
        )
}