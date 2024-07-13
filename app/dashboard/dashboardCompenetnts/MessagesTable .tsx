"use client"
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

interface Message {
  email: string;
  title: string;
  id: string;
}

const MessagesTable = () => {
  const [messagesArryPages, setMessagesArryPages] = useState<Message[][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // حالة التحميل

  const isInitialMount = useRef(true);

  const handelShowMore = async () => {
    setLoading(true); // تفعيل حالة التحميل

    const req = { page: messagesArryPages.length + 1 };
    const req_j = JSON.stringify(req);
    const res = await fetch("/api/messages/get", { method: "POST", body: req_j });

    setLoading(false); // إيقاف حالة التحميل بعد الاستجابة

    if (res.status === 402) return;

    const result = await res.json();
    setMessagesArryPages(prev => [...prev, result.data]);
  };

  useEffect(() => {
    // تحميل البيانات الأولية عند أول تحميل للصفحة
    handelShowMore();
  }, []);

  const handelGoMore = async () => {
    if (currentPage < messagesArryPages.length - 1) {
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

  return (
    <div className="overflow-x-auto rounded-md" id='messages'>
      <h1 className='flex justify-center font-bold p-4 text-red-600'>
        الرسائل الجديدة
      </h1>
      <table className="table-auto min-w-full bg-white border border-gray-200">
        <thead className='bg-gray-100'>
          <tr>
            <th className="py-2 text-left px-4">البريد الإلكتروني</th>
            <th className="py-2 text-left px-4">العنوان</th>
            <th className="py-2 text-left px-4"></th>
          </tr>
        </thead>
        <tbody className='overflow-x-hidden'>
          {messagesArryPages.length > 0 && messagesArryPages[currentPage]?.map((message, indx) => (
            <tr key={indx} className="border-b border-gray-200">
              <td className="px-4 py-2 max-w-2 overflow-ellipsis overflow-hidden">{message.email}</td>
              <td className="px-4 py-2 max-w-2 overflow-ellipsis overflow-hidden">{message.title}</td>
              <td className="px-4 py-2">
                <Link href={`/dashboard/messages/${message.id}`} className="text-green-500 hover:text-green-700">
                  عرض الرسالة
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