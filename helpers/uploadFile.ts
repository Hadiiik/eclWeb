import { supabase } from "@/lib/supabase"

export const uploadFile = async (file:File,full_category_path:string)=>{
    const {data, error} = await supabase.storage.from("files").upload(arabicToUniqueEnglishValue(file.name),file);
    if(data)
        console.log(data)
    if(error)
        console.log(error);
     await uploadFileInfo(file.name,full_category_path);
    
  }
const uploadFileInfo = async (fileName:string,full_category_path:string) =>{
    const { data, error } = await supabase
        .from("files")
        .insert({
            "file_name": fileName, 
            "full_category_path": full_category_path
        });
}

function arabicToUniqueEnglishValue(name:string) {
    const hash = name.split('').reduce((acc, char) => {
        const charCode = char.charCodeAt(0);
        return acc + charCode;
    }, '');
    return hash.toString();
}

