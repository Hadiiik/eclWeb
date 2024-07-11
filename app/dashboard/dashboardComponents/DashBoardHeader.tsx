const DashboardHeader = () => {
    return (
        <>
        <header className="bg-gray-800 text-white py-4 sticky top-0 z-10   md:hidden">
        <div className="text-2xl font-bold start">
                        <a href="/admin/dashboard" className="hover:text-green-400 text-sm text-start">لوحة التحكم</a>
                    </div>
        </header>
        <header className="bg-gray-800 text-white py-4 sticky top-0 z-10 hidden md:block">
                <div className="container mx-auto flex flex-wrap items-center justify-between">
                    <div className="text-2xl font-bold">
                        <a href="/admin/dashboard" className="hover:text-green-400">لوحة التحكم</a>
                    </div>
                    <nav className="space-x-4 flex flex-col md:flex-row mt-4 md:mt-0">
                        <a href="/admin/dashboard" className="hover:text-green-400 mt-2 md:mt-0">الرئيسية</a>
                        <a href="/admin/files" className="hover:text-green-400 mt-2 md:mt-0">الملفات</a>
                        <a href="/admin/users" className="hover:text-green-400 mt-2 md:mt-0">المستخدمين</a>
                        <a href="/admin/messages" className="hover:text-green-400 mt-2 md:mt-0">الرسائل</a>
                    </nav>
                    <div className="mt-4 md:mt-0">
                        <a href="/" className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
                            تسجيل الخروج
                        </a>
                    </div>
                </div>
            </header>
            </>
    );
  };
  
  export default DashboardHeader;