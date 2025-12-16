import { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { addComment } from "../api/apiService";

export default function CommentForm({ postId, onAdded }) {
  const [text, setText] = useState("");

  // const handleSubmit = () => {
  //   addComment(postId, text).then((res) => {
  //     onAdded(res.data);
  //     setText("");
  //   });
  // };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    const res = await addComment(postId, text);
    onAdded(res.data);
    setText("");
  };

  return (
    <div className="mt-4 space-y-2">
      <Input
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit Comment</Button>
    </div>
  );
}
