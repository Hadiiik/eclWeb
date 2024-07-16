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
  const [currentPage, setCurrentPage] = useState(0);
  const [filesPages, setFilePages] = useState<File[][]>([[]]);
  const [erro, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentCatIndx,setCurrentCatIndx] = useState(-1);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (suggestion: string,indx :number) => {
    setSearchTerm(suggestion);
    setCurrentCatIndx(indx);
    onSearch(suggestion);
  };

  const onSearch = async (search_query:string) => {
    if(searchTerm.trim()==""&&search_query.trim()=="")
      return;
    setFilePages([[]]);
    setError(false);
    setLoading(true);
    const req = { "page": 1, "search_query": search_query.trim() };
    const req_body = JSON.stringify(req);
    const res = await fetch("/api/fiels/search", { method: "POST", body: req_body });
    const result = await res.json();
    setLoading(false);
    if (!result.data) {
      setError(true)
      return;
    }
    if (result.data.length == 0)
      setError(true)
    else setError(false)
    setFilePages([result.data]);
    setSearchTerm("");
  }

  const uniqueCategories = [
    "علمي",
    "أدبي",
    "بكالوريا",
    "تاسع"
  ];

  return (
    <>
      <Header />
      <div className="p-4 max-w-4xl mx-auto">
        <div className="mb-4">
          <div className='flex justify-end'>
            <input
              type="search"
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500 "
              placeholder="ابحث عن الملفات..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <p className='text-white p-3 mx-2 bg-green-500 flex self-center rounded-md hover:bg-green-600 hover:cursor-pointer'
              onClick={()=>onSearch(searchTerm)}
            >بحث</p>
          </div>
        </div >
        <div className="grid justify-items-start">
          <div className=' flex px-2 bg-slate-50 w-full justify-end mr-4  rounded-md shadow-sm py-2'>
          {uniqueCategories.map((category, index) => (
            <button
              key={index}
              className={ (index==currentCatIndx)? " text-green-500 bg-slate-100 p-2 rounded-md shadow-md":""+ "flex  text-red-500 hover:text-green-600 mx-2  bg-slate-100 p-2 rounded-md"}
              onClick={() => handleSuggestionClick(category,index)}
            >
              {category}
            </button>
            
          ))}
          </div>
          <br></br>
          {
            loading && <FilesLoadingSkeleton />
          }
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  ">
          {
            erro && <p className=' flex justify-center text-red-600 '>لم يتم العثور على الملفات المطلوبة جرب استخدام كلمات مشابهة</p>
          }
          
          {filesPages[currentPage].map((file) => (
            <div key={file.id} className="border rounded-md p-4 hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-bold"> {file.file_name}</h2>
              <p className="text-sm text-blue-400 overflow-hidden text-ellipsis ">{file.full_category_path.trim().split(" ").join("/")}</p>
            </div>
          ))}
        </div>
        <div className=' flex flex-row-reverse justify-between'>
        <p className={" hidden"+(filesPages.length==0)?"":"block"}>عرض المزيد</p>
        <p className='p-3 hidden'>العودة</p>
        </div>
      </div>
    </>
  );
};

export default SearchPage;

const FilesLoadingSkeleton = () => {
  return (
    <>
    <br></br>
    <div className="flex flex-col items-center justify-center w-full h-full pt-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md space-y-4 w-11/12 md:w-9/12 lg:w-8/12 mx-auto">
            <div className="animate-pulse flex space-x-4 items-center">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};