import Image from "next/image";

const Header = () => {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Image src={"/ecllogo.png"} width={50} height={50} alt="ECL"/>
          <nav className="space-x-4">
            <a href="#main" className="text-red-600 hover:text-red-700 hover:underline px-3"> الرئيسية </a>
            <a href="#" className="text-red-600 hover:text-red-700 hover:underline sm:px-5">   عن الفريق </a>
            <a href="#servises" className="text-red-600 hover:text-red-700 hover:underline"> الخدمات </a>
            <a href="#contact" className="text-red-600 hover:text-red-700 hover:underline"> التواصل </a>
          </nav>
        </div>
      </header>
    );
  }
  
  export default Header;