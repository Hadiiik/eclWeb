import { supabase } from '@/lib/supabase';
import React from 'react'

const Messages = async ({ params }: { params: { id: string } }) => {
   //getting data 
   const {data,error} = await supabase
   .from("messages")
   .select()
   .eq("id",params.id)
   if(error)
    return(
      <div className="container mx-auto p-4 mt-8 max-w-lg bg-red-100 border border-red-400 text-red-700  py-3 rounded relative px-8" role="alert">
        <strong className="font-bold text-right">خطأ: </strong>
        <span className="block sm:inline  text-right">حدث خطأ ما ربما تم حذف هذه الرسالة</span>
      </div>

  );
  
   const message = {
    title: data[0].title,
    email: data[0].email,
    content: data[0].message
  };


  return (
    <div className="container mx-auto p-4 mt-8 max-w-lg bg-white rounded-lg shadow-md text-right">
      <h2 className="text-2xl font-bold text-green-700 mb-4">{message.title}</h2>
      <p className="text-gray-700 mb-2">{message.email}</p>
      <hr className='py-2'></hr>
      <p className="text-gray-700 mb-6 whitespace-pre-wrap">{message.content}</p>
      <a 
        href={`mailto:${message.email}`}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex justify-center mx-5"
      >
        الرد على الرسالة
      </a>
    </div>
  );

}

export default Messages
