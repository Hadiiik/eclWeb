import React from 'react';
import { Table } from 'antd';
//import 'antd/dist/antd.css';

const NewUsersTable = () => {
  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'البريد الإلكتروني', dataIndex: 'email', key: 'email' },
    
  ];

  const data = [
    { key: '1', name: 'محمد', email: 'mohamed@example.com' },
    { key: '2', name: 'ليلى', email: 'leila@example.com' },
    { key: '1', name: 'محمد', email: 'mohamed@example.com' },
    // Add more data as needed
  ];

  return(
    <div id='users'>
        <h1 className=' flex justify-center font-bold p-4 text-red-600'>
            المستخدمين الجدد
        </h1>
   <Table columns={columns} dataSource={data}  direction={"rtl"}/>
   </div>
  );
};

export default NewUsersTable;