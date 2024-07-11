import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
type body = {
    parentCategory:string
}
export async function POST(req:NextRequest){
  console.log("hiii")
    if(!req.cookies.has("sToken"))
        return NextResponse.json({
            message: "not allowed"
          }, {
            status: 405,
          })
    if(req.cookies.get("sToken")?.value!="0511d61eb43e08618abb3c655026957f53a9ccdf592facc800c8de48084549bb")
        return NextResponse.json({
            message: "not allowed"
          }, {
            status: 405,
          })
    const data:body = await req.json();
    return NextResponse.json({
      "hello":"world"
    });

    
}