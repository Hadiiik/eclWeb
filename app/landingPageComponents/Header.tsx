const Header = () => {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-green-700">ECL</div>
          <nav className="space-x-4">
            <a href="#main" className="text-red-600 hover:text-red-700 hover:underline"> الرئيسية </a>
            <a href="#" className="text-red-600 hover:text-red-700 hover:underline sm:px-4">   عن الفريق </a>
            <a href="#servises" className="text-red-600 hover:text-red-700 hover:underline"> الخدمات </a>
            <a href="#contact" className="text-red-600 hover:text-red-700 hover:underline"> التواصل </a>
          </nav>
        </div>
      </header>
    );
  }
  
  export default Header;