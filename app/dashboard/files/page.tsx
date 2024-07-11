"use client"

import { useEffect, useState } from "react";

const Files = () => {
  const [categoriesArry, setCategoriesArry] = useState<string[]>([""]);
  const [optionsMatrix, setOptionsMatrix] = useState<string[][]>([["علمي","ادبي"]]);
  const addCat = () => {
    setCategoriesArry([...categoriesArry, ""]);
  }

  const removeCat = () => {
    if (categoriesArry.length === 1) return;
    const copy = [...categoriesArry];
    copy.pop();
    setCategoriesArry(copy);
  }

  const fetchData = async()=>{
    console.log("hi")
    const res = await fetch("http://localhost:3000/api/fiels/getCategoriesOptions",{
      method:"POST", body:JSON.stringify({"parentCategory":1})
    })
    console.table(res);
  }
  useEffect(()=>{
    console.log("mm")
    
    fetchData();
  })
  return (
    <div className="container mx-auto p-2 m-4">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-6">رفع الملفات</h2>
      <form className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
        <input type="file"/>
        {
          categoriesArry.map((cat, indx) => (
            <div key={indx} className="flex flex-col">
              <label className="text-gray-700 mb-1">التصنيف</label>
              <input 
                type="text" 
                placeholder="اختر تصنيف" 
                list={`list-${indx}`} 
                className="p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              />
              <datalist id={`list-${indx}`}>
                {
                  optionsMatrix[indx].map((op,i)=><option value={op} key={`op-${i}`}></option>)
                }
              </datalist>
            </div>
          ))
        }
        <button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          رفع الملف
        </button>
      </form>
      <div className="flex justify-between mt-4 max-w-md mx-auto space-x-2 w-72 lg:w-full">
        <button 
          onClick={addCat} 
          className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          إضافة تصنيف
        </button>
        <button 
          onClick={removeCat} 
          className="w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          إزالة تصنيف
        </button>
      </div>
    </div>
  )
}

export default Files;