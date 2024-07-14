import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
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
    .select("category_name")
    .eq("parent_category_name",req_body.parentCategory)
    if(error)
      return Response.json({error})
    if(data)
      return Response.json({ data })
    

    
}