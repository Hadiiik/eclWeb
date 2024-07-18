
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic'


export default async function Preview({ params }: { params: { filePath: string } }) {
    const url = await supabase.storage.from('files').createSignedUrl(params.filePath,60,{transform:{quality: 20}});
    console.log(url)
    
    return(
        <div className="flex justify-center h-full">
        <embed src={`${url.data?.signedUrl}`} width="600" height="1000"  
        type="application/pdf"/>
        </div>
    );
}

