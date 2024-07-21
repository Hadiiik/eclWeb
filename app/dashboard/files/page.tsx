"use client"
import { ChangeEvent, FormEvent,  useEffect,  useRef,  useState } from "react";
import DashBoardHeader from "../dashboardCompenetnts/DashBoardHeader";
import { uploadFile } from "@/helpers/uploadFile";
const Files = () => {
  const [categoriesArry, setCategoriesArry] = useState<string[]>([""]);
  const [optionsMatrix, setOptionsMatrix] = useState<string[][]>([["علمي","ادبي"]]);
  const [uploadCount,setUploadedCount] = useState(0);
  const [pendingCount,setPendingCount] = useState(0);
  const [loading,setLoading] = useState(false);
  const [Description,set_Description] = useState("");
  const setDescription = (e:ChangeEvent<HTMLTextAreaElement>)=>{
    set_Description(e.currentTarget.value);
  }
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
    setLoading(true)
    e.preventDefault();
    //post categories
    const postCat = async (category_name:string,parent_category_name:string) =>{
      const catName = category_name.split(" ").join("_");
      console.log(catName)
      const pCatName = parent_category_name.split(" ").join("_");
      const res = await fetch("/api/fiels/postCategories",{
        method:"POST", headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },body:JSON.stringify({"category_name":catName,"parent_category_name":pCatName})
      })
    }
    for(let i=1;i<categoriesArry.length;i++){
      await postCat(categoriesArry[i],categoriesArry[i-1])
    }
    //get full_category_path 
    let full_category_path = "";
    for(let i=0;i<categoriesArry.length;i++)
      full_category_path+= " " + categoriesArry[i].trim();
    setCategoriesArry([""]);
    inputRef.current!.value = "";
    set_Description("");
    
    //upload file 
    if(!fileInputRef.current || !fileInputRef.current.files)
    {
      alert("يرجى اختيار ملف");
      setLoading(false);
      return;
    }
    const fileCount = fileInputRef.current.files.length;
    if(!fileCount)
    {
      alert("خطأ")
      return;
    }
    setPendingCount(pre=>pre+fileCount);
    await wait(200)
    setLoading(false);
    for(let i=0;i<fileInputRef.current.files.length;i++){
    let form_data = new FormData();
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[i]){
    form_data.append("document", fileInputRef.current.files[i])
    if(fileInputRef&&fileInputRef.current&&fileInputRef.current.files)
      full_category_path+= " "+fileInputRef.current.files[i].name.trim();
    full_category_path += " , "+ Description.trim();
    form_data.append("full_category_path",full_category_path)
    //await uploadFileInChunks(fileInputRef.current.files[i],full_category_path);
    //const res = await fetch("/api/fiels/upload",{method:"POST",body:form_data});
    /*if(error)
      console.log(error)
    console.log(data);*/
    try{
      await uploadFile(fileInputRef.current.files[i],full_category_path);
  }catch(er) {alert(er)}
     setUploadedCount(pre=>pre+1);
     setPendingCount(pre=>pre-1);
    }
  }
    

  }
  function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const confirmUnload = (e: { preventDefault: () => void; returnValue: string; }) => {
        // عرض رسالة تأكيد عند محاولة المستخدم إعادة تحميل أو إغلاق الصفحة
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
        return ''; // يجب أن يكون العودة بالسلسلة الفارغة لتجنب تظهر الرسائل المخصصة في بعض المتصفحات
    };

    // إضافة المستمع لـ beforeunload عندما يتم تحميل التطبيق
    window.addEventListener('beforeunload', confirmUnload);

    // إزالة المستمع عندما يتم تفكيك المكون أو إغلاق التطبيق
    return () => {
        window.removeEventListener('beforeunload', confirmUnload);
    };
}, []);

  return (
    <>
    <DashBoardHeader/>
    <br></br>
    <h2 className="text-3xl font-bold text-green-700 text-center mb-6">رفع الملفات</h2>
    {loading&& <UploadFormLoadingSkeleton/>}
    <div className={"container mx-auto p-2 m-4"}>
      <form
        onSubmit={(e)=>{
          onSubmit(e);
        }}
       className={ (loading)?"hidden":""  +" bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto mb-12"}>
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
                ref={inputRef}
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
        <textarea placeholder="  . . . وصف الملف "  className="w-full mt-4 border border-gray-300 rounded focus:outline-none focus:border-green-500 pt-3" onChange={(e)=>{setDescription(e)}} value={Description}/>
        <button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          رفع الملف
        </button>
      </form>
      
      {!loading&&
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
      }
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


const UploadFormLoadingSkeleton = () => {
  return (
    <div className="container mx-auto p-2 m-4">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
        <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
        <div className="flex justify-between space-x-2">
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};