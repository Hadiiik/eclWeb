// pages/index.js
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import NodeCache from 'node-cache';

export const dynamic = 'force-dynamic'
type info = {
    file_name: string, full_category_path: string 
}
// بيانات الملف
const CACHE_DURATION = 2400
const cache = new NodeCache({ stdTTL: CACHE_DURATION});
const getFileInfo = async (file_id:string)=>{
  const key = `get_fileInfo_${file_id}`;
  if(cache.has(key)){
    return cache.get<info[]>(key);
  }
    const {data,error} = await supabase
    .from('files')
    .select(' file_name , full_category_path')
    .eq('id',file_id)
    if(error)
        throw new Error();
    cache.set(key,data)
    return data;
}
const getFileUrl = async (filePath:string,originalFileName:string) =>{
    
const { data } = await supabase
.storage
.from('files')
.createSignedUrl(filePath, 2400,{download:originalFileName})
return data

}

const getThumbnail = async (filePath:string) =>{
    //fix time 
  const { data } = await supabase
.storage
.from('files')
.createSignedUrl("thumbnails"+"/"+filePath+".png", 2400,{transform:{
  quality:40
}})
return data?.signedUrl

}

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

export default async function  Files( {params }: { params: { id: string } }) {
  try{
   const info=  await getFileInfo(params.id);
   if(!info)
    throw new Error()
   let fileName:string = info[0].file_name;
   const fn = fileName.replace('.pdf','')
    fileName = arabicToUniqueEnglishValue(fileName);
   const full_category_path:string = info[0].full_category_path;
   let [categoryPtah,Description]:string[] = full_category_path.split(",");
   categoryPtah = categoryPtah.replace(fn,"");
   const fileUrl = await getFileUrl(fileName,fn);
   let isThumbnail = false;
   const thumbnail = await getThumbnail(fileName);
   console.log(thumbnail)
   if(thumbnail&& await thumbnail!="")
    isThumbnail = true;
  
   const shareText = `حمل ملف ${fn} عبر موقع فريق ECL 
   ecl-web.vercel.app/files/${params.id}
`
  
  return (
    <div className="bg-gray-100 min-h-screen">
     

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">صفحة تحميل الملف</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden text-right">
          <div className="p-4">
            <h2 className="text-xl font-semibold">{fn}</h2>
            <p className="text-green-400 text-sm">{categoryPtah}</p>
            <br></br>
            <h2 className=' text-right '>: وصف الملف</h2>
            <br></br>
            <p className='pb-2'>{Description}</p>
            <hr></hr>
            { isThumbnail &&
            <div className=' flex justify-center mb-4'>
            <img src={thumbnail||""} alt={""}  style={{maxWidth:'100%',height:'auto'}} />
            </div>
            }
            <div className="mt-4 flex flex-col">
            <a
                download={encodeURIComponent(fn)}
                href={fileUrl?.signedUrl}
                className="bg-green-500 text-white  rounded-md hover:bg-green-600 transition-colors duration-300 text-center p-4 m-2"
                
              >
                تحميل الملف
              </a>
              <a
                href={`whatsapp://send?text=${shareText}`} data-action="share/whatsapp/share"
                className="bg-blue-500 text-white  rounded-md hover:bg-blue-600 transition-colors duration-300 text-center p-4 m-2"
                
              >
                مشاركة الملف
              </a>

              <a
                href={`/files/${params.id}/${fileName}`}
                className="bg-gray-400 text-white  rounded-md hover:bg-gray-600 transition-colors duration-300 text-center p-4 m-2"
                target='_blank'
              >
                معاينة الملف
              </a>
              
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}catch{
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold text-right">خطأ:</strong>
      <span className="block sm:inline text-right"> يبدو أن هذا الملف غير موجود، ربما تم حذفه مسبقاً.</span>
    </div>
  );

}
}