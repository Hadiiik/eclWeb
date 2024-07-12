"use client"
import { ChangeEvent, FormEvent,  useRef,  useState } from "react";
import DashBoardHeader from "../dashboardCompenetnts/DashBoardHeader";
const Files = () => {
  const [categoriesArry, setCategoriesArry] = useState<string[]>([""]);
  const [optionsMatrix, setOptionsMatrix] = useState<string[][]>([["علمي","ادبي"]]);
  const [uploadCount,setUploadedCount] = useState(0);
  const [pendingCount,setPendingCount] = useState(0);
  
  const revalidateOptionsMatrix = async (startIndex: number) => {
    for (let i = startIndex + 1; i < categoriesArry.length; i++) {
      const option = await getOPtions(categoriesArry[i - 1]);
      let optionsMatrix_copy = [...optionsMatrix];
      if (JSON.stringify(optionsMatrix_copy[i]) !== JSON.stringify(option)) {
        optionsMatrix_copy[i] = option;
        setOptionsMatrix(optionsMatrix_copy);
      }
    }
  };
  
  const catInputChange = async (e: ChangeEvent<HTMLInputElement>, indx: number) => {
    let categoriesArry_copy = [...categoriesArry];
    categoriesArry_copy[indx] = e.target.value;
    setCategoriesArry(categoriesArry_copy);
  
    // Update options for the current input
    const updatedOptions = await getOPtions(e.target.value);
    let optionsMatrix_copy = [...optionsMatrix];
    if (JSON.stringify(optionsMatrix_copy[indx + 1]) !== JSON.stringify(updatedOptions)) {
      optionsMatrix_copy[indx + 1] = updatedOptions;
      setOptionsMatrix(optionsMatrix_copy);
    }
  
    // Revalidate options for the following inputs
    revalidateOptionsMatrix(indx);
  };

  const  addCat = async () => {
    setCategoriesArry([...categoriesArry, ""]);
    setOptionsMatrix([...optionsMatrix,[""]]);
    //revalidate options matriix
    revalidateOptionsMatrix(categoriesArry.length+1)
  }

  const removeCat = () => {
    if (categoriesArry.length === 1) return;
    const copy = [...categoriesArry];
    copy.pop();
    const optionsMatrix_copy = [...optionsMatrix];
    optionsMatrix_copy.pop();
    setOptionsMatrix(optionsMatrix_copy);
    setCategoriesArry(copy);
  }

  const getOPtions = async(parentCategoryName:string)=>{
    const res = await fetch("/api/fiels/getCategoriesOptions",{
      method:"POST", headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },body:JSON.stringify({"parentCategory":parentCategoryName})
    })
    const d = await res.json()
    let arry_object = d.data
    for(let i=0;i<arry_object.length;i++)
      arry_object[i] = arry_object[i]["category_name"]
    return arry_object
    
  }
  
  
  const onSubmit = async (e:FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    //post categories
    const postCat = async (category_name:string,parent_category_name:string) =>{
      const res = await fetch("/api/fiels/postCategories",{
        method:"POST", headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },body:JSON.stringify({"category_name":category_name,"parent_category_name":parent_category_name})
      })
    }
    for(let i=1;i<categoriesArry.length;i++){
      await postCat(categoriesArry[i],categoriesArry[i-1])
    }
    //get full_category_path 
    let full_category_path = "";
    for(let i=0;i<categoriesArry.length;i++)
      full_category_path+= " " + categoriesArry[i];
    setCategoriesArry([""]);
    
    //upload file 
    if(!fileInputRef.current || !fileInputRef.current.files)
    {
      alert("يرجى اختيار ملف")
      return;
    }
    setPendingCount(fileInputRef.current.files.length);
    for(let i=0;i<fileInputRef.current.files.length;i++){
    let form_data = new FormData();
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[i]){
    form_data.append("document", fileInputRef.current.files[i])
    form_data.append("full_category_path",full_category_path)
     const res = await fetch("/api/fiels/upload",{method:"POST",body:form_data});
     setUploadedCount(pre=>pre+1);
     setPendingCount(pre=>pre-1);
    }
  }
    //
    

  }


  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
    <DashBoardHeader/>
    <div className="container mx-auto p-2 m-4">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-6">رفع الملفات</h2>
      <form
        onSubmit={(e)=>onSubmit(e)}
       className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto ">
        <input type="file" multiple ref={fileInputRef} required/>
        {
          categoriesArry.map((cat, indx) => (
            <div key={indx} className="flex flex-col ">
              <label className="text-gray-700 mb-1">التصنيف</label>
              <input required
                onChange={(e)=>catInputChange(e,indx)}
                type="text" 
                placeholder="اختر تصنيف" 
                list={`list-${indx}`} 
                className="p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              />
              <datalist id={`list-${indx}`}>
                {
                  optionsMatrix[indx]?.map((op,i)=><option value={op} key={`op-${i}`}></option>)
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
      {
        uploadCount>0&&<p className=" flex justify-center text-green-600 mt-5">{`تم رفع ${uploadCount} ملف بنجاح`}</p>
        
      }
      {
        pendingCount>0&&<p className=" flex justify-center text-red-600 mt-5">{`جاري رفع ${pendingCount} ملف `}</p>
      }
    </div>
    </>
  )
}

export default Files;