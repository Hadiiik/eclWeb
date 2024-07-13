"use client"
import React, { useState } from 'react';
import Header from '../landingPageComponents/Header';

interface File {
  id: string;
  name: string;
  category: string;
}

const files: File[] = [
  { id: '1', name: 'ملف 1', category: 'تصنيف 1' },
  { id: '2', name: 'ملف 2', category: 'تصنيف 2' },
  { id: '3', name: 'ملف 3', category: 'تصنيف 1' },
  { id: '4', name: 'ملف 4', category: 'تصنيف 3' },
  // أضف المزيد من الملفات هنا
];

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };
  const handelSearch = async ()=>{
    const req = {"page":1,"search_query":searchTerm};
    const req_body =  JSON.stringify(req);
    const res = await fetch("/api/fiels/search",{method:"POST",body:req_body});
    const result = await res.json();
    console.log(result)

  }

  const filteredFiles = files.filter(file => file.name.includes(searchTerm));

  const uniqueCategories = ["تصنيف 1"];

  return (
    <>
    <Header/>
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <div className=' flex justify-end'>
        <input
          type="search"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500"
          placeholder="ابحث عن الملفات..."
          value={searchTerm}
          onChange={handleSearch}
          
        />
        <p className=' p-3 mx-2 bg-slate-300 flex self-center rounded-md hover:bg-slate-200 hover:cursor-pointer'
            onClick={handelSearch}
        >بحث</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center space-x-2 space-y-2 mb-4">
        {uniqueCategories.map((category, index) => (
          <button
            key={index}
            className="py-2 px-4 rounded-md focus:outline-none bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={() => handleSuggestionClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div key={file.id} className="border rounded-md p-4 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold">{file.name}</h2>
            <p className="text-sm text-gray-500">{file.category}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default SearchPage;