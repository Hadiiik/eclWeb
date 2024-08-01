"use client"
import  { useState } from 'react';
import Link from 'next/link';
import { createHash } from 'crypto';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
type signUpdata = {
  email:string,
  phoneNumber:string,
  passwordHash:string,
  category:string,
  area:string
}

const areasArry = ['إدلب ', 'سرمدا', ' الدانا ', '(أريحا)جيل الزاوية ', 'معرة مصرين ', 'حارم ', 'سلقين ', 'جسر الشغور', 'عفرين ', 'إعزاز', 'قطمة ', 'الباب'];
const categoryArry = ['بكلوريا علمي ', 'بكلوريا أدبي ', 'تاسع ', 'تاسع مجالس محليه ', 'بكلوريا مجالس محلية'];
const SignupPage: React.FC = () => {
  const router = useRouter();
  const [signUpdata,setSignUpdata] = useState<signUpdata>({email:"",phoneNumber:"",passwordHash:"",category:"",area:""});
  const [loading,setLoading] = useState<boolean>(false);
  const [passwordVisible,setPasswordVisible] = useState<boolean>(false);
  return (
    <>
    {loading&&<DashboardSkeleton/>}
    {!loading&&
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mx-4 ">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full my-4">
        <h2 className="text-xl font-semibold text-red-600 text-right justify-center mb-6">إنشاء حساب</h2>
        <form onSubmit={async (e)=>{
          e.preventDefault();
          console.log(signUpdata)
          setLoading(true);
          const req_body = JSON.stringify(signUpdata);
          const res = await fetch('api/auth/sign-up',{
            method:"POST",
            body:req_body
          });
          setLoading(false);
          const result = await res.json();
          console.log(result.status);
          if(result.status!=200){
            if(result.status==401){
              alert("الايميل او رقم الهاتف موجود مسبقا");
              return;
            }
            alert("تعذر انشاء الحساب يرجى ادخال بيانات صالحة")
          }
          router.push('/account');
        }}>
          <div className="mb-4">
            <label className="block text-gray-700">البريد الإلكتروني</label>
            <input type="email" className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500" 
              placeholder='example@gmail.com'
              required
              onChange={(e)=>{
                setSignUpdata({...signUpdata,email:e.currentTarget.value})
              }} 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">رقم الهاتف</label>
            <input type="tel" className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500" 
              placeholder='ex: +352789563130'
              required
              onChange={(e)=>{
                setSignUpdata({...signUpdata,phoneNumber:e.currentTarget.value});
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">كلمة المرور</label>
            <div className=' flex flex-row rounded-md border focus:outline-none focus:border-green-500'>
            <input type={passwordVisible?"text":"password"} className="w-full p-3    focus:border-green-500" 
              placeholder='اختر كلمة مرور قوية وطويلة'
              required
              onChange={(e)=>{
                setSignUpdata({...signUpdata,passwordHash:hashString(e.currentTarget.value)});
              }}
            />
            <button type='button' className=' text-sm m-2' onClick={()=>{setPasswordVisible(!passwordVisible)}} >
              <Image src={passwordVisible?'/showPassword.svg':"/hidePassword.svg"} alt='عرض الكلمة' width={30} height={30}/>
            </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">المرحلة الدراسية</label>
            <select className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500 pt"
              required
              onChange={(e)=>{
                setSignUpdata({...signUpdata,category:e.currentTarget.value});
              }}
            >
              <option value="">اختر المرحلة الدراسية</option>
              {
                categoryArry.map((cat,i)=><option value={cat} key={i}>{cat}</option>)
              }
            </select>

          </div>
          <div className="mb-4">
            <label className="block text-gray-700">المنطقة</label>
            <select className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500 pt"
              required
              onChange={(e)=>{
                setSignUpdata({...signUpdata,area:e.currentTarget.value});
              }}
            >
              <option value="">اختر المنطقة </option>
              {
                areasArry.map((area,i)=><option value={area} key={i}>{area}</option>)
              }
            </select>
          </div>
          <button type="submit" className="w-full p-3 bg-green-700 text-white rounded-md hover:bg-green-800">إنشاء حساب</button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          لديك حساب بالفعل؟ <Link href="/log-in " className='text-blue-500 hover:underline'>تسجيل الدخول</Link>
        </p>
      </div>
    </div>
}
    </>
  );
};

export default SignupPage;

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