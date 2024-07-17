"use client"
import  {  useState } from 'react';
import Header from '../landingPageComponents/Header';


interface File {
  id: string;
  file_name: string;
  full_category_path: string;
}
const cache = new Map();
const cache_search = new Map();

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [filesPages, setFilePages] = useState<File[][]>([[]]);
  const [erro, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentCatIndx,setCurrentCatIndx] = useState(-1);
  const [emptyPage,setemptyPage] = useState(true);
  const [noMoreFileserror,setNoMoreFileserror] = useState(false);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (suggestion: string,indx :number) => {
    setemptyPage(true);
    setFilePages([[]]);
    setSearchTerm(suggestion);
    setCurrentCatIndx(indx);
    onSearch(suggestion);
  };

  const handelGoMore = async () => {
    if(noMoreFileserror)
      return;
    if(loading)
      return
    setNoMoreFileserror(false);
    setCurrentPage(pre=>pre+1);
    setLoading(true);
    const key = `search_${searchTerm}_${currentPage+1}`;
    if(cache.has(key)){
      console.log("c")
      console.log(cache.get(key))
      setFilePages([...filesPages,cache.get(key)]);
      setLoading(false);
      window.scroll(0, 0);
      return;
    }
    const req = { "page": currentPage+2, "search_query": searchTerm.trim() };
    const req_body = JSON.stringify(req);

      const res = await fetch("/api/fiels/search", { method: "POST", body: req_body });
      const result = await res.json();
      if(result.data.length==0){
        setNoMoreFileserror(true);
        setCurrentPage(pre=>pre-1);
        cache.set(key,result.data);
        setLoading(false);
        window.scroll(0, 0);
        return;
      }
      setFilePages([...filesPages,result.data]);
      window.scroll(0, 0);
      cache.set(key,result.data);
      setLoading(false)

  };
  
  const onSearch = async (search_query: string) => {
    if(loading)
      return
    setemptyPage(true);
    setNoMoreFileserror(false);
    if (search_query.trim() === "") return;
    setFilePages([[]]);
    setCurrentPage(0);
    setError(false);
    setLoading(true);
    const key = `search_${searchTerm}_${currentPage+1}`;
    if(cache_search.has(key)){
      setError(false);
        setFilePages([cache_search.get(key)]);
        setemptyPage(false);
        setLoading(false);
      return;
    }
    const req = { "page": 1, "search_query": search_query.trim() };
    const req_body = JSON.stringify(req);
    try {
      const res = await fetch("/api/fiels/search", { method: "POST", body: req_body });
      const result = await res.json();
      setLoading(false);
      if (!result.data || result.data.length === 0) {
        setError(true);
      } else {
        setError(false);
        setFilePages([result.data]);
        cache_search.set(key,result.data)
        setemptyPage(false);
      }
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };
  
  const handleBack = () => {
    window.scroll(0, 0);
    setNoMoreFileserror(false);
    if(currentPage<=0)
      return;
    setCurrentPage(currentPage-1);
  };


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
              type="text"
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500  text-right"
              placeholder=". . . ابحث عن ملفات"
              value={searchTerm}
              onChange={handleSearch}
            />
            <p className='text-white p-3 mx-2 bg-green-500 flex self-center rounded-md hover:bg-green-600 hover:cursor-pointer'
              onClick={()=>onSearch(searchTerm)}
            >بحث</p>
          </div>
        </div >
        <div className="grid justify-items-start">
          
          {
            loading && <FilesLoadingSkeleton />
          }
        </div>
        <div className={(loading?"hidden":" ")+"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  "}>
          {
            erro && <p className=' flex justify-center text-red-600 '>لم يتم العثور على الملفات المطلوبة جرب استخدام كلمات مشابهة</p>
            
          }
          {
            noMoreFileserror && <p className=' flex justify-center text-red-600 '>لم يتبقى نتائج بحث</p>
          }
          
          { (!loading)&&filesPages[currentPage]?.map((file) => (
            <div key={file.id} className="border rounded-md p-4 hover:shadow-lg transition-shadow overflow-hidden">
              <p className="text-lg font-bold text-wrap"> {file.file_name}</p>
              <p className="text-sm text-blue-400 overflow-hidden truncate">{file.full_category_path.trim().split(" ").reverse().join("/")}</p>
            </div>
          ))}
        </div>
        <div className={(emptyPage?"hidden": "flex flex-row-reverse justify-between py-2 bg-slate-50 my-4 mx-2 rounded-md")}>
        <p className={(emptyPage?"hidden":"p-2 px-4 text-blue-500 hover:text-blue-600 hover:cursor-pointer")} onClick={handelGoMore} >عرض المزيد</p>
        <p className={(emptyPage?"hidden":"p-2 text-red-500 px-4 hover:text-red-600 hover:cursor-pointer")} onClick={handleBack}>العودة</p>
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