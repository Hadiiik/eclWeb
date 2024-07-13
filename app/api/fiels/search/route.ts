import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

type Body = {
    page: number,
    search_query: string
}

export async function POST(req: NextRequest) {
    const cookie = req.cookies.get('user-data');
    if (!cookie) {
        return new Response("error");
    }

    const req_body: Body = await req.json();
    const page = req_body.page;
    const LIMIT = 6;
    const start = (page - 1) * LIMIT;
    const end = start + LIMIT - 1;
    const search_query = req_body.search_query;

    const { data, error } = await supabase
        .from("files")
        .select("file_name, id, full_category_path")
        .ilike("full_category_path", `%${search_query}%`)
        .order("created_at", { ascending: false })
        .range(start, end);

    if (error) {
        console.error(error);
        return NextResponse.json({ status: 402 });
    }

    console.log(data);
    return NextResponse.json({ data });
}