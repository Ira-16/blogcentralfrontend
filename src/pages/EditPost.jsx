import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../api/apiService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostById(id)
      .then((res) => {
        const post = res.data;
        setTitle(post.title);
        setContent(post.content);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load post");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = () => {
    updatePost(id, { title, content })
      .then(() => navigate(`/posts/${id}`))
      .catch((err) => {
        console.error(err);
        alert("Failed to update post");
      });
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 space-y-3 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Edit Post</h1>

      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Button onClick={handleUpdate}>Update Post</Button>
    </div>
  );
}
