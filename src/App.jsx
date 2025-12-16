import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PrivateRoute from "./auth/PrivateRoute";
import NavBar from "./components/NavBar";
import PostDetail from "./pages/PostDetail";
import SearchResults from "./pages/SearchResults";
import ManageUsers from "./pages/ManageUsers";

import CreatePost from "./pages/CreatePost";
import MyPosts from "./pages/MyPosts";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manage-users" element={<ManageUsers />} />
      </Routes>
    </BrowserRouter>
  );
}

//   return (
//     <BrowserRouter>
//       <NavBar />

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <PrivateRoute>
//               <Home />
//             </PrivateRoute>
//           }
//         />

//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         <Route
//           path="/create"
//           element={
//             <PrivateRoute>
//               <CreatePost />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/myposts"
//           element={
//             <PrivateRoute>
//               <MyPosts />
//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }
