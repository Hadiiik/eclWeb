import React from 'react';
import { Table } from 'antd';
import Link from 'next/link';
//import 'antd/dist/antd.css';

const RecentFilesTable = () => {
  const columns = [
    { title: 'اسم الملف', dataIndex: 'fileName', key: 'fileName' },
    { title: 'تاريخ الإضافة', dataIndex: 'dateAdded', key: 'dateAdded' },
  ];

  const data = [
    { key: '1', fileName: 'file1.pdf', dateAdded: '2024-07-12' },
    { key: '2', fileName: 'file2.docx', dateAdded: '2024-07-11' },
    // Add more data as needed
  ];

  return (
    <div id='files'>
        <h1 className=' flex justify-center font-bold p-4 text-red-600'>
            الملفات المضافة مؤخرا 
        </h1>
  <Table columns={columns} dataSource={data} direction={"rtl"} />
  <Link href={"/dashboard/files"}  className='flex justify-center p-3 bg-green-700 mb-9 mx-10 rounded-md text-white hover:bg-green-800' >اضافة ملفات</Link>
  </div>
);
};

export default RecentFilesTable;