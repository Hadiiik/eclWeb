import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    if(!req.cookies.has("sToken"))
        return NextResponse.json({
            message: "method not allowed"
          }, {
            status: 405,
          })
    if(req.cookies.get("sToken")?.value!=process.env.S_TOKEN)
        return NextResponse.json({
            message: "method not allowed"
          }, {
            status: 405,
          })
    //upload to telgram           
    let file:FormData =await req.formData() ;
     let res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT}/sendDocument?chat_id=${process.env.CHAT_ID}`, 
        {method:"POST",body:file}
     );
    const reponse_body = await res.json()
    const file_id = reponse_body.result.document.file_id;
    const file_name = reponse_body.result.document.file_name;
    //upload to supabase 
    return new Response("done")    
}