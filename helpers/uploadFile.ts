import { supabase } from "@/lib/supabase"

export const uploadFile = async (file:File,full_category_path:string)=>{
    const {data, error} = await supabase.storage.from("files").upload("/"+file.name,file);
    if(error)
        return true;
    return await uploadFileInfo(file.name,full_category_path);
    
  }
const uploadFileInfo = async (fileName:string,full_category_path:string) =>{
    const { data, error } = await supabase
        .from("files")
        .insert({
            "file_name": fileName, 
            "full_category_path": full_category_path
        });
    if(error)
        return true 
    return null;
}