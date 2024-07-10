"use client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import Cookies from "js-cookie"
import { createHash } from "crypto"

type singUpdata = {
    userName : string,
    password : string
}
const SignUp = () => {
    const [singUpdata,setSingUpData] = useState<singUpdata>({userName:"",password:""});
    const router = useRouter();
    const onSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        console.log(singUpdata)
        // set cookies 
        Cookies.set('sToken', getHash(singUpdata.userName+""+singUpdata.password), { expires: 7 })
        router.push("/")
        
    }
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full space-y-6" onSubmit={(e)=>onSubmit(e)}>
          <h2 className="text-2xl font-bold text-center text-red-600">تسجيل الدخول</h2>
          <div>
            <label className="block text-gray-700">اسم المستخدم</label>
            <input 
            onChange={(e)=>{setSingUpData({...singUpdata,userName:e.target.value})}}
              type="text" 
              placeholder="اسم المستخدم" 
              required 
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-gray-700">كلمة المرور</label>
            <input 
            onChange={(e)=>{setSingUpData({...singUpdata,password:e.target.value})}}
              type="password" 
              placeholder="كلمة المرور" 
              required 
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit" 
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-green-600 transition duration-200"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </>
  )
}

const getHash = (inputString:string) => {
    // إنشاء كائن لتشفير SHA-256
    const hash = createHash('sha256');
    // تحويل النص إلى بيانات بت
    hash.update(inputString);
    // الحصول على الهاش كسترينج بصيغة hex (التحويل إلى سترينج)
    return hash.digest('hex');
}


export default SignUp