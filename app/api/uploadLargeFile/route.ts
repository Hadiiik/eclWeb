import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { NextRequest, NextResponse } from "next/server";

type File = {
    name: string,
    fileId: string,
    totalParts: number,
    telegram_file_ids: string
}

let processingFilesArry: File[] = [];

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
        console.log("start parsing ")
    const formData = await req.formData();
    const file_id = formData.get("fileId")?.toString();
    if (!file_id)
        return new Response("error");

    const t = formData.get("totalParts");
    if (!t)
        return new Response("error");
    const total_parts = parseInt(t.toString());
    const pn = formData.get("partNumber");
    if (!pn)
        return new Response("error");
    const part_number = parseInt(pn.toString());

    const n = formData.get("name");
    if (!n)
        return new Response("error");
    const name = n.toString();

    const fcn = formData.get("full_category_path");
    if (!fcn)
        return new Response("error");
    const full_category_path = fcn.toString();

    const document = formData.get("document");
    
    if (!document)
        return new Response("error");
    
    console.log("Document info: ", document);

    const fd = new FormData();
    fd.append('document', document);
    console.log("uploading to telegram")
    try {
        const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT}/sendDocument?chat_id=${process.env.CHAT_ID}`, {
            method: "POST",
            body: fd
        });

        const responseBody = await res.json();
        console.log(responseBody);

        if (!responseBody.ok) {
            return NextResponse.json({
                message: "Error uploading file to Telegram"
            }, {
                status: 500,
            });
        }

        const telegram_file_id = responseBody.result.document.file_id;

        let file_process_indx = -1;
        for (let i = 0; i < processingFilesArry.length; i++)
            if (processingFilesArry[i].fileId == file_id) {
                file_process_indx = i;
                break;
            }

        if (file_process_indx == -1) {
            processingFilesArry.push({ fileId: file_id, totalParts: total_parts, telegram_file_ids: telegram_file_id, name: name });
            if(total_parts>1)
            return new Response("done");
        }
        console.log("here")
        processingFilesArry[file_process_indx].telegram_file_ids += "," + telegram_file_id;

        if (processingFilesArry[file_process_indx].totalParts == part_number) {
            const { data, error } = await supabase
                .from("files")
                .insert({
                    "file_name": name,
                    "file_id": processingFilesArry[file_process_indx].telegram_file_ids,
                    "full_category_path": full_category_path
                });
            console.log(data)
            if (error)
                return NextResponse.json({
                    message: "not uploaded"
                }, {
                    status: 422,
                });

            return NextResponse.json({
                message: "uploaded successfully",
                file_name: name
            }, {
                status: 201,
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({
            message: "Internal server error"
        }, {
            status: 500,
        });
    }
}