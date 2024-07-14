import { similarChars } from "@/helpers/similarChars";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

type Body = {
    page: number,
    search_query: string
};

// دالة لإنشاء مجموعة فريدة من الكلمات المشابهة لكلمة البحث
function generateSimilarWords(search_query: string): Set<string> {
    const similarWords = new Set<string>();
    
    // إضافة الكلمة الأصلية
    similarWords.add(search_query);
    
    // إضافة الكلمات المشابهة
    for (let i = 0; i < search_query.length; i++) {
        const char = search_query[i];
        if (similarChars[char]) {
            for (const similarChar of similarChars[char]) {
                const similarWord = search_query.substring(0, i) + similarChar + search_query.substring(i + 1);
                similarWords.add(similarWord);
            }
        }
    }
    
    return similarWords;
}

// دالة الانتظار لعدد محدد من المللي ثانية
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

    // إنشاء مجموعة فريدة من الكلمات المشابهة
    const similarWords = generateSimilarWords(search_query);
console.log(similarWords)
    // إنشاء شروط التصفية لكل كلمة مشابهة
    const filters = Array.from(similarWords).map(word => `full_category_path.ilike.%${word}%`).join(',');

    // تنفيذ البحث باستخدام شروط التصفية المدمجة
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

    // الانتظار لمدة 500 مللي ثانية
    await wait(500);

    return NextResponse.json({ data });
}