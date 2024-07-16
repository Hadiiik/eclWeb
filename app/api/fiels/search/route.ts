import { sanitizeInput } from "@/helpers/sanitizeInput";
import { similarChars } from "@/helpers/similarChars";
import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { NextRequest, NextResponse } from "next/server";
import NodeCache from "node-cache";

type Body = {
    page: number,
    search_query: string
};
const CACHE_DURATION = 10 * 60; // min 

// دالة لإنشاء مجموعة فريدة من الكلمات المشابهة لكلمات البحث
function generateSimilarWords(search_query: string): Set<string> {
    const similarWords = new Set<string>();
    let words = search_query.split(' '); // تقسيم البحث إلى كلمات فردية
    words = words.filter(ele => ele !== " " && ele !== "");

    for (const word of words) {
        // إضافة الكلمة الأصلية
        similarWords.add(word);

        // إضافة الكلمة مع "ال" التعريف إذا لم تكن موجودة
        if (!word.startsWith("ال")) {
            similarWords.add("ال" + word);
        }

        // إضافة الكلمة بدون "ال" التعريف إذا كانت موجودة
        if (word.startsWith("ال")) {
            similarWords.add(word.substring(2));
        }

        // إضافة الكلمات المشابهة
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (similarChars[char]) {
                for (const similarChar of similarChars[char]) {
                    const similarWord = word.substring(0, i) + similarChar + word.substring(i + 1);
                    similarWords.add(similarWord);

                    // إضافة الكلمات المشابهة مع "ال" التعريف إذا لم تكن موجودة
                    if (!similarWord.startsWith("ال")) {
                        similarWords.add("ال" + similarWord);
                    }

                    // إضافة الكلمات المشابهة بدون "ال" التعريف إذا كانت موجودة
                    if (similarWord.startsWith("ال")) {
                        similarWords.add(similarWord.substring(2));
                    }
                }
            }
        }
    }

    return similarWords;
}

// دالة الانتظار لعدد محدد من المللي ثانية
function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const cache = new NodeCache({ stdTTL: 60 * 60 });

export async function POST(req: NextRequest) {
    const rateLimitResponse = await rateLimiterMiddleware(req);
    if (rateLimitResponse) return rateLimitResponse;
    const cookie = req.cookies.get('user-data');
    if (!cookie) {
        return new Response("error");
    }
    const req_body: Body = await req.json();
    const page = req_body.page;
    const LIMIT = 20;
    const start = (page - 1) * LIMIT;
    const end = start + LIMIT - 1;
    const search_query = sanitizeInput(req_body.search_query);
    // cache 
    const key = `search_${page}_${search_query}`;

    if (cache.has(key)) {
        await wait(500);
        return NextResponse.json(cache.get(key));
    }

    // إنشاء مجموعة فريدة من الكلمات المشابهة
    const similarWords = generateSimilarWords(search_query);
    // إنشاء شروط التصفية لكل كلمة مشابهة
    let filters = Array.from(similarWords).map(word => `full_category_path.ilike.%${word}%`).join(',');
    // تنفيذ البحث باستخدام شروط التصفية المدمجة
    const { data, error } = await supabase
        .from("files")
        .select("file_name, id, full_category_path")
        .or(filters)
        .order("created_at", { ascending: false })
        .range(start, end);
    cache.set(key, { data })
    if (error) {
        return NextResponse.json({ status: 402 });
    }
    // الانتظار لمدة 500 مللي ثانية
     await wait(1000);
    return NextResponse.json({ data });
}