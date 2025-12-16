//import { useAuth } from "../auth/useAuth";
import { getAllPosts } from "../api/apiService";
import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";

export default function Home() {
  //const { logout } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // getAllPosts().then((res) => setPosts(res.data));
    getAllPosts()
      .then((res) => {
        console.log("API Response:", res.data);
        const postsArray = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setPosts(postsArray);
      })
      .catch((err) => {
        console.error(err);
        setPosts([]); // fallback
      });
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Blog Posts</h1>

      {Array.isArray(posts) &&
        posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
