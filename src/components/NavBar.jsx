import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth/useAuth";
import { Bell } from "lucide-react";
import api from "@/api/axios";

export default function NavBar() {
  const { token, user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const nav = useNavigate();

  const onSearch = () => {
    if (search) nav(`/search?keyword=${search}`);
  };

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  // Fetch pending applications count for admin/manager
  useEffect(() => {
    if (token && (user?.role === "ADMIN" || user?.role === "MANAGER")) {
      // Get all jobs and count pending applications
      api.get("/api/posts")
        .then(async (res) => {
          const jobs = Array.isArray(res.data) ? res.data : res.data.data || [];
          let total = 0;
          for (const job of jobs.slice(0, 10)) { // Check first 10 jobs
            try {
              const appRes = await api.get(`/api/applications/job/${job.id}`);
              const apps = Array.isArray(appRes.data) ? appRes.data : [];
              total += apps.filter(a => a.status === "PENDING").length;
            } catch (e) {
              // Ignore errors
            }
          }
          setPendingCount(total);
        })
        .catch(() => {});
    }
  }, [token, user]);

  useEffect(() => {
    console.log("Current user:", user);
  }, [user]);

  return (
    <header className="bg-indigo-600 text-white p-4 flex flex-wrap items-center justify-between">
      <h1
        className="text-xl font-bold cursor-pointer hover:text-indigo-200"
        onClick={() => nav("/")}
      >
        INTWORK
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
            {/* Notification Bell */}
            <button 
              onClick={() => nav("/applications")}
              className="relative hover:text-indigo-200 p-1"
              title="Job Applications"
            >
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  {pendingCount > 9 ? "9+" : pendingCount}
                </span>
              )}
            </button>
          </>
        )}

        {token && user?.role === "MANAGER" && (
          <>
            <Link to="/manage-users" className="hover:text-indigo-200">
              Manage Users
            </Link>
            {/* Notification Bell */}
            <button 
              onClick={() => nav("/applications")}
              className="relative hover:text-indigo-200 p-1"
              title="Job Applications"
            >
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  {pendingCount > 9 ? "9+" : pendingCount}
                </span>
              )}
            </button>
          </>
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
