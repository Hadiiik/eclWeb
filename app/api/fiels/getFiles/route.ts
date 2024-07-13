import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
type body = {
    page:number
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
    console.log(req_body)
    const page = req_body.page;
    const LIMIT = 6;
    const start = (page-1)*LIMIT;
    const end = start+LIMIT-1
    //get a page  messages from supabase
    const {data,error} = await supabase
    .from("files")
    .select("file_name,created_at,id")
    .order("created_at",{ascending:false})
    .range(start,end);
    if(error)
      return NextResponse.json({status:402});
    return NextResponse.json({data});

}