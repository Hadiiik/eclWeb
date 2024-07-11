import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
type body = {
    parentCategory:string
}

export async function POST(req:NextRequest){
    if(!req.cookies.has("sToken"))
        return NextResponse.json({
            message: "not allowed"
          }, {
            status: 405,
          })
    if(req.cookies.get("sToken")?.value!=process.env.S_TOKEN)
        return NextResponse.json({
            message: "not allowed"
          }, {
            status: 405,
          })
    const req_body:body = await req.json();
    const {data,error} = await supabase.from("categories")
    .select()
    .eq("parent_category_name",req_body.parentCategory)
    if(error){
      console.log(error)
      console.log("error")
      return new Response("error")
    }
    if(data)
    {
      console.log("data")
      console.log(data)
      return Response.json({ data })
    }
    

    
}