// pages/index.js
import { supabase } from '@/lib/supabase';
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
const getPreviewUrl = async (filePath:string,originalFileName:string) =>{
    
  const { data } = await supabase
  .storage
  .from('files')
  .createSignedUrl(filePath, 240,{download:false,transform:{quality:20}})
  return data
  
  }
function arabicToUniqueEnglishValue(name:string) {
    const hash = name.split('').reduce((acc, char) => {
        const charCode = char.charCodeAt(0);
        return acc + charCode;
    }, '');
    return hash.toString();
}

export default async function  Files( {params }: { params: { id: string } }) {
  try{
   const info=  await getFileInfo(params.id);
   if(!info)
    throw new Error()
   let fileName = info[0].file_name;
   const fn = fileName
    fileName = arabicToUniqueEnglishValue(fileName);
   const full_category_path = info[0].full_category_path;
   const fileUrl = await getFileUrl(fileName,fn);
   const filePreviewUrl = await getPreviewUrl(fileName,fn);
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
            <p className="text-green-400 text-sm">{full_category_path}</p>
            <br></br>
            <h2 className=' text-right '>: وصف الملف</h2>
            <br></br>
            <p className='pb-2'>لسا ما ضفنا وصف امية الكويسة بس منضيف بعدين</p>
            <hr></hr>
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