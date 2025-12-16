import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, getCommentsForPost } from "../api/apiService";
import CommentItem from "../components/CommentItem";
import CommentForm from "../components/CommentForm";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getPostById(id).then((res) => setPost(res.data));
    getCommentsForPost(id).then((res) => setComments(res.data));
  }, [id]);

  const handleAdded = (comment) => setComments((prev) => [...prev, comment]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p>{post.content}</p>
      <div className="mt-4 space-y-2">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </div>
      <CommentForm postId={id} onAdded={handleAdded} />
    </div>
  );
}
