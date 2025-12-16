import { useState } from "react";
import { createPost } from "../api/apiService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const nav = useNavigate();

  const handleSave = () => {
    createPost({ title, content }).then(() => nav("/"));
  };

  return (
    <div className="p-4 space-y-2">
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
      <Button onClick={handleSave}>Save Post</Button>
    </div>
  );
}
