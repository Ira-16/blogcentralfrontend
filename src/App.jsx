import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PrivateRoute from "./auth/PrivateRoute";
import NavBar from "./components/NavBar";
import PostDetail from "./pages/PostDetail";
import SearchResults from "./pages/SearchResults";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Applications from "./pages/Applications";
import AllPosts from "./pages/AllPosts";
import Jobs from "./pages/Jobs";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<AllPosts />} />
        <Route path="/posts/:id/:slug?" element={<PostDetail />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id/:slug?" element={<PostDetail />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<PrivateRoute><EditPost /></PrivateRoute>} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/manage-users" element={<PrivateRoute><ManageUsers /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}