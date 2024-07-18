import { supabase } from "@/lib/supabase";




export default async function Preview({ params }: { params: { filePath: string } }) {
    const url =  supabase.storage.from('files').getPublicUrl(params.filePath);
    return(
        <div className="flex justify-center h-full">
        <embed src={url.data.publicUrl} width="100%" height="1000" 
        type="application/pdf"/>
        </div>
    );
}

