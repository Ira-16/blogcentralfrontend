import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { addComment } from "../api/apiService";
import { useAuth } from "@/auth/useAuth";
import { Send } from "lucide-react";

export default function CommentForm({ postId, onAdded }) {
  const { token } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || !token) return;

    setLoading(true);
    try {
      const res = await addComment(postId, text);
      onAdded(res.data);
      setText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <p className="text-sm text-gray-500 mt-4">
        Please log in to leave a comment.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      <Input
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
        className="rounded-lg"
      />
      <Button 
        onClick={handleSubmit} 
        disabled={loading || !text.trim()}
        className="rounded-full bg-[#1a1a2e] hover:bg-[#2d2d44] text-white"
      >
        <Send className="h-4 w-4 mr-2" />
        {loading ? "Posting..." : "Post Comment"}
      </Button>
    </div>
  );
}
