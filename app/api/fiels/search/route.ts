import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

type Body = {
    page: number,
    search_query: string
}

// Function to generate sliding window substrings from the search query
function generateSlidingWindowSubstrings(query: string, windowSize: number): string[] {
    const substrings = [];
    for (let i = 0; i <= query.length - windowSize; i++) {
        substrings.push(query.substring(i, i + windowSize));
    }
    return substrings;
}

// Function to wait for a specified number of milliseconds
function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

    // Generate substrings using sliding window of size 3
    const substrings = generateSlidingWindowSubstrings(search_query, 3);
    console.log(substrings);

    // Create the filter conditions for each substring
    const filters = substrings.map(substring => `full_category_path.ilike.%${substring}%`).join(',');

    // Perform search with the combined filter
    const { data, error } = await supabase
        .from("files")
        .select("file_name, id, full_category_path")
        .or(filters)
        .order("created_at", { ascending: false })
        .range(start, end);

    if (error) {
        console.error(error);
        return NextResponse.json({ status: 402 });
    }

    // Wait for 500 ms
    await wait(500);

    return NextResponse.json({ data });
}