import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  getCommentsForPost,
  updateComment,
  deleteComment,
  updatePost,
  deletePost,
} from "../api/apiService";
import CommentItem from "../components/CommentItem";
import CommentForm from "../components/CommentForm";
import { useAuth } from "../auth/useAuth";
import { Button } from "../components/ui/button";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth(); // Logged-in user

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  // Fetch post and comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await getPostById(id);
        const commentsRes = await getCommentsForPost(id);

        setPost(postRes.data || null);
        setComments(commentsRes.data || []);
      } catch (err) {
        console.error(err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Start editing post
  const startEditing = () => {
    if (!post) return;
    setEditing(true);
    setEditForm({ title: post.title || "", content: post.content || "" });
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditForm({ title: "", content: "" });
  };

  const savePost = async () => {
    if (!post) return;

    try {
      // Only send DTO fields
      const dto = { title: editForm.title, content: editForm.content };
      const res = await updatePost(post.id, dto);
      setPost(res.data);
      cancelEditing();
    } catch (err) {
      console.error(err);
      alert("You cannot edit this post");
    }
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!post) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(post.id);
      alert("Post deleted");
      navigate("/"); // Redirect to homepage
    } catch (err) {
      console.error(err);
      alert("You cannot delete this post");
    }
  };

  // Edit comment
  const handleEditComment = async (updatedComment) => {
    try {
      await updateComment(updatedComment.id, {
        content: updatedComment.content,
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === updatedComment.id
            ? { ...c, content: updatedComment.content }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("You are not allowed to edit this comment");
    }
  };

  // Delete comment
  const handleDeleteComment = async (comment) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await deleteComment(comment.id);
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (err) {
      console.error(err);
      alert("You are not allowed to delete this comment");
    }
  };

  // Add new comment
  const handleAddedComment = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  const canEditOrDeletePost =
    currentUser &&
    (currentUser.id === post.author?.id ||
      ["ADMIN", "EDITOR"].includes(currentUser?.role));

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* POST */}
      <div className="border-b pb-4">
        {editing ? (
          <>
            <input
              value={editForm.title}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border w-full mb-2 px-2 py-1"
              placeholder="Title"
            />
            <textarea
              value={editForm.content}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, content: e.target.value }))
              }
              className="border w-full px-2 py-1"
              rows={6}
              placeholder="Content"
            />
            <div className="mt-2 flex gap-2">
              <Button onClick={savePost} className="bg-green-500 text-white">
                Save
              </Button>
              <Button
                onClick={cancelEditing}
                className="bg-gray-400 text-white"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-700">{post.content}</p>
            {canEditOrDeletePost && (
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={startEditing}
                  className="bg-blue-500 text-white"
                >
                  Edit Post
                </Button>
                <Button
                  onClick={handleDeletePost}
                  className="bg-red-500 text-white"
                >
                  Delete Post
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* COMMENTS */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Comments</h2>
        {comments.length === 0 && (
          <p className="text-gray-500">No comments yet.</p>
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        ))}
      </div>

      {/* ADD COMMENT */}
      <CommentForm postId={id} onAdded={handleAddedComment} />
    </div>
  );
}
