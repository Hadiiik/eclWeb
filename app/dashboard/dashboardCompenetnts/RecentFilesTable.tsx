"use client"
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

interface File {
  file_name: string;
  created_at: string;
  id: string;
}

const MessagesTable = () => {
  const [filesArryPages, setFilesArryPages] = useState<File[][]>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [loading, setLoading] = useState(false); // حالة التحميل

  const isInitialMount = useRef(true);

  const handelShowMore = async () => {
    setLoading(true); // تفعيل حالة التحميل

    const req = { page: filesArryPages.length + 1 };
    const req_j = JSON.stringify(req);
    const res = await fetch("/api/fiels/getFiles", { method: "POST", body: req_j });

    setLoading(false); // إيقاف حالة التحميل بعد الاستجابة

    if (res.status === 402) return;

    const result = await res.json();
    if(!result.data)
      return
    if(result.data.length==0)
      return;
    setFilesArryPages(prev => [...prev, result.data]);
  };

  useEffect(() => {
    // تحميل البيانات الأولية عند أول تحميل للصفحة
    handelShowMore();
    handelGoMore()
  }, []);

  const handelGoMore = async () => {
    if (currentPage < filesArryPages.length - 1) {
      setCurrentPage(pre => pre + 1);
    } else {
      await handelShowMore();
      setCurrentPage(pre => pre + 1);
    }
  };

  const handeGoBack = () => {
    if (currentPage > 0) {
      setCurrentPage(pre => pre - 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = dateString.split('T')[0];
    return date;
  };

  return (
    <div className="overflow-x-auto rounded-md pt-4" id="messages">
      <Link href={"/dashboard/files"} className=' flex justify-center bg-green-600 py-4 mb-3 rounded-md mx-20 text-sm text-white hover:bg-green-700'> تحميل ملفات</Link>
      <hr></hr>
      <hr></hr>
      <h1 className='flex justify-center font-bold p-4 text-red-600'>
        الملفات المضافة مؤخرا 
      </h1>
      <table className="table-auto min-w-full bg-white border border-gray-200 ">
        <thead className='bg-gray-100 '>
          <tr className=''>
            <th className="py-2 text-left px-4">اسم الملف</th>
            <th className="py-2 text-left px-4">تاريخ الانشاء</th>
            <th className="py-2 text-left px-4"></th>
          </tr>
        </thead>
        <tbody className='overflow-x-hidden'>
          {filesArryPages.length > 0 && filesArryPages[currentPage]?.map((file, indx) => (
            <tr key={indx} className="border-b border-gray-200 hover:bg-slate-100 transition-all">
              <td className="px-4 py-2 max-w-2 overflow-ellipsis overflow-hidden">{file.file_name}</td>
              <td className="px-4 py-2 max-w-2 overflow-ellipsis overflow-hidden">{formatDate(file.created_at)}</td>
              <td className="px-4 py-2">
                <Link href={`/dashboard/messages/${file.id}`} className="text-green-500 hover:text-green-700">
                  عرض الملف
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-between'>
        <p
          className={`pt-3 text-left flex ${currentPage === 0 ? 'text-gray-400' : 'text-blue-400 hover:text-blue-600 hover:cursor-pointer'}`}
          onClick={handeGoBack}
        >
          العودة
        </p>
        <p
          className={`text-blue-500 hover:text-blue-600 hover:cursor-pointer pt-3 flex text-right ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={handelGoMore}
        >
          {loading ? 'جارٍ التحميل...' : 'عرض المزيد'}
        </p>
      </div>
      <hr className='my-3 bg-black'></hr>
    </div>
  );
};

export default MessagesTable;