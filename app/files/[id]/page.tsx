// pages/index.js

import { supabase } from '@/lib/supabase';
import Head from 'next/head';

// بيانات الملف
const file = {
  title: 'ملف العنوان الأول',
  category: 'الفئة الأولى',
  image: '/images/file1.jpg',
  fileUrl: '/files/file1.pdf',
  previewUrl: '/previews/file1-preview',
};
const getFileInfo = async (file_id:string)=>{
    const {data,error} = await supabase
    .from('files')
    .select(' file_name , full_category_path')
    .eq('id',file_id)
    if(error)
        throw new Error();
    return data;
}
const getFileUrl = async (filePath:string) =>{
    
const { data } = await supabase
.storage
.from('files')
.createSignedUrl(filePath, 3600)
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
   const info =  await getFileInfo(params.id);
   let fileName = info[0].file_name;
    fileName = arabicToUniqueEnglishValue(fileName)
   const full_category_path = info[0].full_category_path;
   const fileUrl = await getFileUrl(fileName);
   const shareText = `حمل ملف ${fileName} عبر موقع فريق ECL 
   ecl-web.vercel.app/files/${params.id}
}`
   //const downloadUrl 
  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>صفحة تحميل الملف</title>
        <meta name="description" content={`تحميل ملف ${file.title}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">صفحة تحميل الملف</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden text-right">
          <div className="p-4">
            <h2 className="text-xl font-semibold">{fileName}</h2>
            <p className="text-green-400 text-sm">{full_category_path}</p>
            <br></br>
            <h2 className=' text-right '>: وصف الملف</h2>
            <br></br>
            <p className='pb-2'>لسا ما ضفنا وصف امية الكويسة بس منضيف بعدين</p>
            <hr></hr>

            <div className="mt-4 flex flex-col">
            <iframe src={fileUrl?.signedUrl} width="100%" height="600px" title="File Preview"></iframe>

            <a
                href={fileUrl?.signedUrl}
                className="bg-green-500 text-white  rounded-md hover:bg-green-600 transition-colors duration-300 text-center p-4 m-2"
                download
              >
                تحميل الملف
              </a>
              <a
                href={`whatsapp://send?text=${shareText}`} data-action="share/whatsapp/share"
                className="bg-blue-500 text-white  rounded-md hover:bg-blue-600 transition-colors duration-300 text-center p-4 m-2"
                
              >
                مشاركة الملف
              </a>
              
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}