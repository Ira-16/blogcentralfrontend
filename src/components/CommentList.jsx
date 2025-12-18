import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import {
  getCommentsForPost,
  updateComment,
  deleteComment,
} from "../api/apiService";

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // IIFE (Immediately Invoked Function Expression)
    (async () => {
      try {
        const res = await getCommentsForPost(postId);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [postId]);

  // handle edit
  const handleEdit = async (updatedComment) => {
    setError(null);
    try {
      const res = await updateComment(updatedComment.id, {
        content: updatedComment.content,
      });
      // update local state with response from server
      setComments((prev) =>
        prev.map((c) => (c.id === updatedComment.id ? res.data : c))
      );
    } catch (err) {
      console.error("Edit comment error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to update comment";
      setError(errorMsg);
      alert("Error: " + errorMsg);
    }
  };

  // handle delete
  const handleDelete = async (comment) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    setError(null);
    try {
      await deleteComment(comment.id);
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (err) {
      console.error("Delete comment error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to delete comment";
      setError(errorMsg);
      alert("Error: " + errorMsg);
    }
  };

  // handle new comment added from CommentForm
  const handleAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      <CommentForm postId={postId} onAdded={handleAdded} />
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
