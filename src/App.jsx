import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PrivateRoute from "./auth/PrivateRoute";
import NavBar from "./components/NavBar";
import PostDetail from "./pages/PostDetail";
import SearchResults from "./pages/SearchResults";
import CreatePost from "./pages/CreatePost";
import Applications from "./pages/Applications";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id/:slug?" element={<PostDetail />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
