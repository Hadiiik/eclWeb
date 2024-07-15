import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { NextRequest, NextResponse } from "next/server";

export const responseLimit = "20mb";

export async function POST(req: NextRequest) {
    const rateLimitResponse = await rateLimiterMiddleware(req);
    if (rateLimitResponse) return rateLimitResponse;

    if (!req.cookies.has("sToken"))
        return NextResponse.json({
            message: "method not allowed"
        }, {
            status: 405,
        });

    if (req.cookies.get("sToken")?.value != process.env.S_TOKEN)
        return NextResponse.json({
            message: "method not allowed"
        }, {
            status: 405,
        });

    // الحصول على بيانات النموذج
    let formData: FormData = await req.formData();
    let file = formData.get("document");
    let full_category_path = formData.get("full_category_path");

    // التحقق من أن الملف موجود وأنه من النوع File
    if (!file || !(file instanceof File)) {
        return NextResponse.json({
            message: "No file uploaded or the file is not valid"
        }, {
            status: 400,
        });
    }
    console.log("start uploading")
    // تحديد الحد الأقصى لحجم الجزء (5 ميجابايت)
    const MAX_CHUNK_SIZE =5 * 1024 * 1024; // 5 ميجابايت

    // تحقق من حجم الملف وتجزئته إذا لزم الأمر
    let fileChunks = [];
    if (file.size > MAX_CHUNK_SIZE) {
        let start = 0;
        while (start < file.size) {
            let end = Math.min(start + MAX_CHUNK_SIZE, file.size);
            let chunk = file.slice(start, end);
            fileChunks.push(chunk);
            start = end;
        }
    } else {
        fileChunks.push(file);
    }

    // مصفوفة لتخزين file_id لكل جزء
    let fileIds = [];
    console.log(fileChunks)

    // تحميل كل جزء إلى Telegram
    for (let chunk of fileChunks) {
        let chunkFormData = new FormData();
        chunkFormData.append("document", chunk, file.name);
        let res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT}/sendDocument?chat_id=${process.env.CHAT_ID}`, 
            { method: "POST", body: chunkFormData }
        );

        const responseBody = await res.json();
        if (!responseBody.ok) {
            return NextResponse.json({
                message: "Error uploading file to Telegram"
            }, {
                status: 500,
            });
        }

        const file_id = responseBody.result.document.file_id;
        fileIds.push(file_id); // أضف file_id إلى المصفوفة
    }

    // تحويل مصفوفة file_id إلى سلسلة نصية مفصولة بفواصل
    const fileIdsString = fileIds.join(",");

    // رفع إلى Supabase
    const { data, error } = await supabase
        .from("files")
        .insert({
            "file_name": file.name, 
            "file_id": fileIdsString, // استخدم السلسلة النصية هنا
            "full_category_path": full_category_path
        });
    if(error)
    return NextResponse.json({
        message: "not uploaded"
    }, {
        status: 422,
    });
    return NextResponse.json({
      message: "uploaded successfully",
      file_name :file.name
  }, {
      status: 201,
  });
}

