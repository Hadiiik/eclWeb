type user ={
    name:string
}
type users = {
    users:user[]
}
const UserList = ({ users }:users) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-bold mb-4 text-red-600">قائمة بأسماء المستخدمين</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index} className="mb-2">
              {user.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default UserList;