type file = {
    name :string,
    link:string
}
type fiels = {
    files : file[]
}
const RecentFiles = ({ files }:fiels) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-red-600">الملفات المرفوعة مؤخرا</h2>
        <ul>
          {files.map((file, index) => (
            <li key={index} className="mb-2">
              <a href={file.link} className="text-green-600 hover:underline">
                {file.name}
              </a>
            </li>
          ))}
        </ul>
        <a href="/upload" className="text-blue-500 hover:underline mt-4 block">رفع ملف جديد</a>
      </div>
    );
  };
  
  export default RecentFiles;