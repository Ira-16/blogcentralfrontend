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
    try {
      await updateComment(updatedComment.id, {
        content: updatedComment.content,
      });
      // update local state immediately
      setComments((prev) =>
        prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // handle delete
  const handleDelete = async (comment) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await deleteComment(comment.id);
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (err) {
      console.error(err);
    }
  };

  // handle new comment added from CommentForm
  const handleAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  return (
    <div>
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
