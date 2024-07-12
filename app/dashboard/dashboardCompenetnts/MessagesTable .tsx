import Link from 'next/link';
import React from 'react';

interface Message {
  key: string;
  name: string;
  email: string;
  subject: string;
}

const MessagesTable = () => {
  const messages: Message[] = [
    { key: '1', name: 'أحمد', email: 'ahmed@example.com', subject: 'استفسار حول المنتجات' },
    { key: '2', name: 'سارة', email: 'sarah@example.com', subject: 'شكوى بخصوص الخدمة' },
    { key: '1', name: 'أحمد', email: 'ahmed@example.com', subject: 'استفسار حول المنتجات' },
    { key: '2', name: 'سارة', email: 'sarah@example.com', subject: 'شكوى بخصوص الخدمة' },
    // Add more messages as needed
  ];

  return (
    <div className="overflow-x-auto rounded-md" id='messages'>
        <h1 className=' flex justify-center font-bold p-4 text-red-600'>
            الرسائل الجديدة
        </h1>
      <table className="table-auto min-w-full bg-white border border-gray-200 ">
        <thead className="bg-gray-100">
          <tr>
            <th className="  py-2 text-left px-4 ">الاسم</th>
            <th className=" py-2 text-left  px-4">البريد الإلكتروني</th>
            <th className=" py-2  text-left px-4">العنوان</th>
            <th className=" py-2  text-left px-4"></th>
          </tr>
        </thead>
        <tbody className=' overflow-x-hidden'>
          {messages.map((message) => (
            <tr key={message.key} className="border-b border-gray-200">
              <td className="px-4 py-2">{message.name}</td>
              <td className="px-4 py-2  max-w-2 overflow-ellipsis overflow-hidden">{message.email}</td>
              <td className="px-4 py-2 max-w-2 overflow-ellipsis overflow-hidden">{message.subject}</td>
              <td className="px-4 py-2">
                <Link href={`/messages/${message.key}`} className="text-green-500 hover:text-green-700">
                  عرض الرسالة
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        <hr className='my-3 bg-black'></hr>
    </div>
  );
};

export default MessagesTable;