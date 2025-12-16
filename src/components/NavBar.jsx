import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth/useAuth";

export default function NavBar() {
  const { token, user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const nav = useNavigate();

  const onSearch = () => {
    if (search) nav(`/search?keyword=${search}`);
  };

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  useEffect(() => {
    console.log("Current user:", user);
  }, [user]);

  return (
    <header className="bg-indigo-600 text-white p-4 flex flex-wrap items-center justify-between">
      <h1
        className="text-xl font-bold cursor-pointer hover:text-indigo-200"
        onClick={() => nav("/")}
      >
        Blog Central
      </h1>

      <nav className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
        <Link to="/" className="hover:text-indigo-200">
          Home
        </Link>

        {/* Role-based links */}
        {token && user?.role === "ADMIN" && (
          <>
            <Link to="/create" className="hover:text-indigo-200">
              Create Post
            </Link>
            <Link to="/manage-users" className="hover:text-indigo-200">
              Manage Users
            </Link>
          </>
        )}

        {token && user?.role === "MANAGER" && (
          <Link to="/manage-users" className="hover:text-indigo-200">
            Manage Users
          </Link>
        )}

        {token && user?.role === "USER" && (
          <Link to="/myposts" className="hover:text-indigo-200">
            My Posts
          </Link>
        )}

        {/* Search */}
        <div className="flex gap-2 ml-0 md:ml-4 mt-2 md:mt-0">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-black"
          />
          <Button onClick={onSearch}>Search</Button>
        </div>

        {/* Auth Links */}
        <div className="ml-0 md:ml-4 flex gap-2 mt-2 md:mt-0">
          {!token ? (
            <>
              <Link to="/login" className="hover:text-indigo-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-indigo-200">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:text-indigo-200 bg-white text-indigo-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "../auth/useAuth"; // Make sure this exists

// export default function NavBar() {
//   const { token, logout } = useAuth(); // Get login state and logout function
//   const [search, setSearch] = useState("");
//   const nav = useNavigate();

//   const onSearch = () => {
//     if (search) nav(`/search?keyword=${search}`);
//   };

//   const handleLogout = () => {
//     logout(); // Clear auth/token
//     nav("/login"); // Redirect to login page
//   };

//   return (
//     <header className="bg-indigo-600 text-white p-4 flex items-center justify-between">
//       {/* Logo / Home */}
//       <h1
//         className="text-xl font-bold cursor-pointer hover:text-indigo-200"
//         onClick={() => nav("/")}
//       >
//         Blog Central
//       </h1>

//       {/* Navigation Links */}
//       <nav className="flex items-center gap-4">
//         <Link to="/" className="hover:text-indigo-200">
//           Home
//         </Link>

//         {/* Only show if logged in */}
//         {token && (
//           <>
//             <Link to="/create" className="hover:text-indigo-200">
//               Create Post
//             </Link>
//             <Link to="/myposts" className="hover:text-indigo-200">
//               My Posts
//             </Link>
//           </>
//         )}

//         {/* Search */}
//         <div className="flex gap-2 ml-4">
//           <Input
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="text-black"
//           />
//           <Button onClick={onSearch}>Search</Button>
//         </div>

//         {/* Auth Links */}
//         <div className="ml-4 flex gap-2">
//           {!token ? (
//             <>
//               <Link to="/login" className="hover:text-indigo-200">
//                 Login
//               </Link>
//               <Link to="/register" className="hover:text-indigo-200">
//                 Register
//               </Link>
//             </>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="hover:text-indigo-200 bg-white text-indigo-600 px-3 py-1 rounded"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// }
