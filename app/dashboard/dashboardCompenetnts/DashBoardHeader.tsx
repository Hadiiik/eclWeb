import Image from "next/image";
import Link from "next/link";

const DashBoardHeader = () => {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Image src={"/ecllogo.png"} width={40} height={40} alt="ECL"/>
          <nav className="space-x-4 text-sm">
            <Link href="/dashboard" className="text-green-700 hover:text-green-800 hover:underline  pl-3"> اللوحة  </Link>
            <Link href="/dashboard#messages" className="text-red-600 hover:text-red-700 hover:underline ">  الرسائل </Link>
            <Link href="/dashboard#files" className="text-red-600 hover:text-red-700 hover:underline"> الملفات </Link>
            <Link href="/dashboard#users" className="text-red-600 hover:text-red-700 hover:underline"> المستخدمين </Link>
          </nav>
        </div>
      </header>
    );
  }
  
  export default DashBoardHeader;