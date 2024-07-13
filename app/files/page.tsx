"use client"
import React, { useState } from 'react';
import Header from '../landingPageComponents/Header';

interface File {
  id: string;
  file_name: string;
  full_category_path: string;
}



const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage,setCurrentPage] = useState(0);
  const [filesPages,setFilePages] = useState<File[][]>([[{full_category_path:"",file_name:"",id:""}]]);
  const [erro,setError] = useState(false);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };
  const onSearch = async ()=>{
    const req = {"page":1,"search_query":searchTerm};
    const req_body =  JSON.stringify(req);
    const res = await fetch("/api/fiels/search",{method:"POST",body:req_body});
    const result = await res.json();
    if(!result.data){
      setError(true)
      return;
    }
    setError(false)
    console.log(result.data)
    setFilePages([...filesPages,result.data]);
    setCurrentPage(pre=>pre+1);

  }

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
            onClick={onSearch}
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
        {
          (filesPages[currentPage].length==0  || erro) && <p className='flex justify-center text-red-600'>لم يتم العثور على الملفات المطلوبة جرب استخدام كلمات مشابهة</p> 
        }
        {filesPages[currentPage].slice(1).map((file) => (
          <div key={file.id} className="border rounded-md p-4 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold"> {file.file_name}</h2>
            <p className="text-sm text-blue-400 overflow-hidden text-ellipsis ">{file.full_category_path.trim().split(" ").join("/")}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default SearchPage;