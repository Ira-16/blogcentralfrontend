import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPostById,
  getCommentsForPost,
  updateComment,
  deleteComment,
} from "../api/apiService";
import CommentItem from "../components/CommentItem";
import CommentForm from "../components/CommentForm";

export default function PostDetail() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch post + comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await getPostById(id);
        const commentsRes = await getCommentsForPost(id);

        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✏️ Edit comment (author only – backend enforced)
  const handleEdit = async (updatedComment) => {
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

  // 🗑️ Delete comment (author or admin – backend enforced)
  const handleDelete = async (comment) => {
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

  // ➕ Add new comment
  const handleAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* POST */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-700">{post.content}</p>
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
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* ADD COMMENT */}
      <CommentForm postId={id} onAdded={handleAdded} />
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getPostById, getCommentsForPost } from "../api/apiService";
// import CommentItem from "../components/CommentItem";
// import CommentForm from "../components/CommentForm";

// export default function PostDetail() {
//   const { id } = useParams();
//   const [post, setPost] = useState(null);
//   const [comments, setComments] = useState([]);

//   useEffect(() => {
//     getPostById(id).then((res) => setPost(res.data));
//     getCommentsForPost(id).then((res) => setComments(res.data));
//   }, [id]);

//   const handleAdded = (comment) => setComments((prev) => [...prev, comment]);

//   if (!post) return <p>Loading...</p>;

//   return (
//     <div className="p-4 space-y-4">
//       <h1 className="text-3xl font-bold">{post.title}</h1>
//       <p>{post.content}</p>
//       <div className="mt-4 space-y-2">
//         {comments.map((c) => (
//           <CommentItem key={c.id} comment={c} />
//         ))}
//       </div>
//       <CommentForm postId={id} onAdded={handleAdded} />
//     </div>
//   );
// }
