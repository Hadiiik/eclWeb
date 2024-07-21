import { supabase } from "@/lib/supabase";

// دالة لتحميل مكتبة PDF.js من السكريبت
const loadPdfJs = () => {
    return new Promise<void>((resolve, reject) => {
        if (typeof (window as any ).pdfjsLib  !== 'undefined') {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
        script.async = true;
        script.defer = true;

        script.onload = () => resolve();
        script.onerror = () => reject(new Error('فشل تحميل مكتبة PDF.js'));

        document.body.appendChild(script);
    });
};

export const uploadFile = async (file: File, full_category_path: string) => {
    // تأكد من تحميل PDF.js
    await loadPdfJs();

    // تعيين مصدر عامل PDF.js
    (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

    // رفع الملف إلى Supabase
    const { data, error } = await supabase.storage.from("files").upload(arabicToUniqueEnglishValue(file.name), file);
    if (data) console.log(data);
    if (error) console.log(error);

    await uploadFileInfo(file.name, full_category_path);

    // معالجة ملف PDF
    const pdf_file = await file.arrayBuffer();
    const pdf = await (window as any).pdfjsLib.getDocument({ data: pdf_file }).promise;
    const canvas = document.createElement("canvas");
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.5 });
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport }).promise;

    const image = canvas.toDataURL();
    await uploadImageToSupabase(image, arabicToUniqueEnglishValue(file.name) + ".png");
};

const uploadFileInfo = async (fileName: string, full_category_path: string) => {
    const { data, error } = await supabase
        .from("files")
        .insert({
            "file_name": fileName,
            "full_category_path": full_category_path
        });
    if (error) console.log(error);
};
const simpleHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
    }
    // تحويل القيمة إلى قاعدة 36 (رقم و حروف)
    return hash.toString(36);
};

const arabicToUniqueEnglishValue = (name: string) => {
    return simpleHash(name);
};

const uploadImageToSupabase = async (image: string, fileName: string) => {
    const blob = dataURItoBlob(image);
    const { data, error } = await supabase.storage.from("files").upload(`thumbnails/${fileName}`, blob);
    if (data) console.log(data);
    if (error) console.log(error);
};

const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: mimeString });
};