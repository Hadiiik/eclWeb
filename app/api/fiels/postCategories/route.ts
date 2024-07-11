import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
type body = {
    categoryName:string,
    parentCategoryName:string
}

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
    const req_body:body = await req.json();
    const {data,error} = await supabase.from("categories").insert(req_body)
    if(data)
        return new Response("posted ")
    if(error)
        return new Response("something went wrong")
    

    
}