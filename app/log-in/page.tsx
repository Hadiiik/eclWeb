"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createHash } from 'crypto';
import { useRouter } from 'next/navigation';
type logInData = {
  email:string,
  passwordHash:string
}

const LoginPage: React.FC = () => {
  const router = useRouter()

  const [passwordVisible,setPasswordVisible] = useState<boolean>(false);
  const [logInData,setLogInData] = useState<logInData>({email:"",passwordHash:""});
  const [loading,setLoading] = useState<boolean>(false);

  return (
    <>
    {loading&&<DashboardSkeleton/>}
    {!loading&&
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-red-600 text-right mb-6">تسجيل الدخول</h2>
        <form onSubmit={async(e)=>{
          e.preventDefault();
          setLoading(true);
          const req_body = JSON.stringify(logInData);
          const res = await fetch('/api/auth/log-in',{
            method:"POST",
            body:req_body
          });
          const result = await res.json();
          setLoading(false)
          if(result.status!=200)
          {
            alert("تعذر تسجيل الدخول حاول مرة اخرى")
            return;
          }
          router.push('/account');

        }}>
          <div className="mb-4">
            <label className="block text-gray-700">البريد الإلكتروني</label>
            <input type="email" className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500"
              required
              onChange={(e)=>{
                setLogInData({...logInData,email:e.target.value})
              }}
             />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">كلمة المرور</label>
            <div className=' flex flex-row rounded-md border focus:outline-none focus:border-green-500'>
            <input type={passwordVisible?"text":"password"} className="w-full p-3    focus:border-green-500" 
              required
              onChange={(e)=>{
                setLogInData({...logInData,passwordHash:hashString(e.target.value)})
              }}
            />
            <button type='button' className=' text-sm m-2' onClick={()=>{setPasswordVisible(!passwordVisible)}} >
              <Image src={passwordVisible?'/showPassword.svg':"/hidePassword.svg"} alt='عرض الكلمة' width={30} height={30}/>
            </button>
            </div>
          </div>
          <button type="submit" className="w-full p-3 bg-green-700 text-white rounded-md hover:bg-green-800">تسجيل الدخول</button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          ليس لديك حساب؟ <Link href="/sign-up" className='text-blue-500 hover:underline'>إنشاء حساب</Link>
        </p>
      </div>
    </div>
    }
    </>
  );
};

export default LoginPage;
function hashString(stringToHash:string) {
  // Create a hash object with the desired algorithm
  const hash = createHash('sha256');
  
  // Update the hash with the input string
  hash.update(stringToHash);
  
  // Convert the hash to a hex string and return it
  return hash.digest('hex');
}
const DashboardSkeleton = () => {
  return (
    <div className="p-4 lg:mx-48">
      {/* Header Skeleton */}
      <div className="animate-pulse flex space-x-4 mb-4 ">
        <div className="h-10 bg-gray-300 rounded w-1/4"></div>
        <div className="h-10 bg-gray-300 rounded w-3/4"></div>
      </div>

      {/* Table Skeleton */}
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-full"></div>
        <div className="h-8 bg-gray-300 rounded w-full"></div>
        <div className="h-8 bg-gray-300 rounded w-full"></div>
        <div className="h-8 bg-gray-300 rounded w-full"></div>
      </div>

      {/* Pagination Skeleton */}
      <div className="animate-pulse flex justify-between mt-4">
        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );
};