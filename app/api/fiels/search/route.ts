import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

type Body = {
    page: number,
    search_query: string
}

// Function to generate random unique substrings from the search query
function generateUniqueSubstrings(query: string, count: number): string[] {
    const substrings = new Set<string>();
    const length = query.length;

    // Ensure the length of the substrings is at least 2 characters shorter than the original query
    const substringLength = Math.max(length - 2, 1);

    while (substrings.size < count) {
        const start = Math.floor(Math.random() * (length - substringLength));
        const end = start + substringLength;
        const substring = query.substring(start, end);
        substrings.add(substring);
    }

    return Array.from(substrings);
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

    // Generate three unique random substrings from the search query
    const substrings = generateUniqueSubstrings(search_query, 3);
    console.log(substrings)
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
        return NextResponse.json({ status: 402 });
    }

    return NextResponse.json({ data });
}