import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import ApplyModal from "../components/ApplyModal";
import { useAuth } from "../auth/useAuth";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Share2,
  Bookmark,
  Send,
} from "lucide-react";
import { formatRelativeTime } from "@/utils/formatDate";

// Parse job details from content
function parseJobContent(content) {
  if (!content) return { location: null, contract: null, sections: [] };

  const lines = content.split("\n");
  let location = null;
  let contract = null;
  let sections = [];
  let currentSection = { title: "About the Role", items: [] };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes("**Location:**")) {
      location = trimmed.replace("**Location:**", "").trim();
    } else if (trimmed.includes("**Contract:**")) {
      contract = trimmed.replace("**Contract:**", "").trim();
    } else if (trimmed.endsWith(":") && trimmed.length < 50) {
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { title: trimmed.slice(0, -1), items: [] };
    } else if (trimmed) {
      currentSection.items.push(trimmed);
    }
  }

  if (currentSection.items.length > 0) {
    sections.push(currentSection);
  }

  return { location, contract, sections };
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [deleting, setDeleting] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

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

  // Post editing
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
      const dto = { title: editForm.title, content: editForm.content };
      const res = await updatePost(post.id, dto);
      setPost(res.data);
      cancelEditing();
    } catch (err) {
      console.error(err);
      alert("You cannot edit this post");
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(post.id);
      alert("Post deleted");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("You cannot delete this post");
    }
  };

  // Comment actions
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

  const handleAddedComment = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  // Apply Modal
  const handleApplyClick = () => {
    if (!token) {
      navigate("/login", { state: { from: `/posts/${id}` } });
      return;
    }
    setShowApplyModal(true);
  };

  // Delete job (for owner/admin)
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job posting?"))
      return;

    setDeleting(true);
    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  const canEditOrDeletePost =
    currentUser &&
    (currentUser.id === post.author?.id ||
      ["ADMIN", "EDITOR"].includes(currentUser?.role));

  const isOwner =
    currentUser &&
    (currentUser.role === "ADMIN" ||
      post.author?.username === currentUser.username);
  const { location, contract, sections } = parseJobContent(post.content);
  const authorName =
    post.author?.username || post.author?.firstName || "Company";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Link>

      {/* Main Card */}
      <Card className="overflow-hidden p-0">
        {post.imageUrl && (
          <div className="w-full h-80 overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover rounded-t-xl"
            />
          </div>
        )}

        <CardContent className="p-8">
          {/* Title Row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {post.title}
              </h1>
              {post.createdAt && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Posted{" "}
                  {formatRelativeTime(post.createdAt)}
                </span>
              )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              {isOwner ? (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/edit/${id}`}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-1" /> Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Job Meta Badges */}
          <div className="flex flex-wrap gap-3 py-4 mb-6 border-y border-gray-100">
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full">
              <Building2 className="h-4 w-4" />{" "}
              <span className="font-medium">{authorName}</span>
            </div>
            {location && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                <MapPin className="h-4 w-4" />{" "}
                <span className="font-medium">{location}</span>
              </div>
            )}
            {contract && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
                <Briefcase className="h-4 w-4" />{" "}
                <span className="font-medium">{contract}</span>
              </div>
            )}
          </div>

          {/* Job Sections */}
          <div className="space-y-6">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Apply Button */}
          <div className="mt-8 pt-6 border-t">
            <Button
              size="lg"
              className="w-full md:w-auto px-8"
              onClick={handleApplyClick}
            >
              <Send className="h-4 w-4 mr-2" /> Apply for this Position
            </Button>
            {!token && (
              <p className="text-sm text-muted-foreground mt-2">
                You need to{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  log in
                </Link>{" "}
                to apply
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        jobTitle={post.title}
        postId={id}
      />

      {/* Comments Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">
            Comments ({comments.length})
          </h2>
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              ))
            )}
          </div>
          {token && <CommentForm postId={id} onAdded={handleAddedComment} />}
        </CardContent>
      </Card>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getPostById,
//   getCommentsForPost,
//   updateComment,
//   deleteComment,
//   updatePost,
//   deletePost,
// } from "../api/apiService";
// import CommentItem from "../components/CommentItem";
// import CommentForm from "../components/CommentForm";
// import { useAuth } from "../auth/useAuth";
// import { Button } from "../components/ui/button";

// import { useParams, useNavigate, Link } from "react-router-dom";
// import { getPostById, getCommentsForPost, deletePost } from "../api/apiService";
// import { useAuth } from "@/auth/useAuth";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Pencil, Trash2, ArrowLeft, MapPin, Briefcase, Building2, Calendar, Share2, Bookmark, Send } from "lucide-react";
// import { formatRelativeTime } from "@/utils/formatDate";
// import CommentItem from "../components/CommentItem";
// import CommentForm from "../components/CommentForm";
// import ApplyModal from "../components/ApplyModal";

// // Parse job details from content
// function parseJobContent(content) {
//   if (!content) return { location: null, contract: null, sections: [] };

//   const lines = content.split("\n");
//   let location = null;
//   let contract = null;
//   let sections = [];
//   let currentSection = { title: "About the Role", items: [] };

//   for (const line of lines) {
//     const trimmed = line.trim();
//     if (trimmed.includes("**Location:**")) {
//       location = trimmed.replace("**Location:**", "").trim();
//     } else if (trimmed.includes("**Contract:**")) {
//       contract = trimmed.replace("**Contract:**", "").trim();
//     } else if (trimmed.endsWith(":") && trimmed.length < 50) {
//       // New section header
//       if (currentSection.items.length > 0) {
//         sections.push(currentSection);
//       }
//       currentSection = { title: trimmed.slice(0, -1), items: [] };
//     } else if (trimmed) {
//       currentSection.items.push(trimmed);
//     }
//   }

//   if (currentSection.items.length > 0) {
//     sections.push(currentSection);
//   }

//   return { location, contract, sections };
// }

// export default function PostDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user: currentUser } = useAuth(); // Logged-in user

//   const [post, setPost] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [editForm, setEditForm] = useState({ title: "", content: "" });
//   const { token, user } = useAuth();
//   const [post, setPost] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [deleting, setDeleting] = useState(false);
//   const [showApplyModal, setShowApplyModal] = useState(false);

//   // Fetch post and comments
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const postRes = await getPostById(id);
//         const commentsRes = await getCommentsForPost(id);

//         setPost(postRes.data || null);
//         setComments(commentsRes.data || []);
//       } catch (err) {
//         console.error(err);
//         setPost(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   // Start editing post
//   const startEditing = () => {
//     if (!post) return;
//     setEditing(true);
//     setEditForm({ title: post.title || "", content: post.content || "" });
//   };

//   const cancelEditing = () => {
//     setEditing(false);
//     setEditForm({ title: "", content: "" });
//   };

//   const savePost = async () => {
//     if (!post) return;

//     try {
//       // Only send DTO fields
//       const dto = { title: editForm.title, content: editForm.content };
//       const res = await updatePost(post.id, dto);
//       setPost(res.data);
//       cancelEditing();
//     } catch (err) {
//       console.error(err);
//       alert("You cannot edit this post");
//     }
//   };

//   // Delete post
//   const handleDeletePost = async () => {
//     if (!post) return;
//     if (!window.confirm("Are you sure you want to delete this post?")) return;

//     try {
//       await deletePost(post.id);
//       alert("Post deleted");
//       navigate("/"); // Redirect to homepage
//     } catch (err) {
//       console.error(err);
//       alert("You cannot delete this post");
//     }
//   };

//   // Edit comment
//   const handleEditComment = async (updatedComment) => {
//     try {
//       await updateComment(updatedComment.id, {
//         content: updatedComment.content,
//       });
//       setComments((prev) =>
//         prev.map((c) =>
//           c.id === updatedComment.id
//             ? { ...c, content: updatedComment.content }
//             : c
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       alert("You are not allowed to edit this comment");
//     }
//   };

//   // Delete comment
//   const handleDeleteComment = async (comment) => {
//     if (!window.confirm("Are you sure you want to delete this comment?"))
//       return;

//     try {
//       await deleteComment(comment.id);
//       setComments((prev) => prev.filter((c) => c.id !== comment.id));
//     } catch (err) {
//       console.error(err);
//       alert("You are not allowed to delete this comment");
//     }
//   };

//   // Add new comment
//   const handleAddedComment = (newComment) => {
//     setComments((prev) => [newComment, ...prev]);
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!post) return <p>Post not found</p>;

//   const canEditOrDeletePost =
//     currentUser &&
//     (currentUser.id === post.author?.id ||
//       ["ADMIN", "EDITOR"].includes(currentUser?.role));

//   return (
//     <div className="max-w-3xl mx-auto p-4 space-y-6">
//       {/* POST */}
//       <div className="border-b pb-4">
//         {editing ? (
//           <>
//             <input
//               value={editForm.title}
//               onChange={(e) =>
//                 setEditForm((prev) => ({ ...prev, title: e.target.value }))
//               }
//               className="border w-full mb-2 px-2 py-1"
//               placeholder="Title"
//             />
//             <textarea
//               value={editForm.content}
//               onChange={(e) =>
//                 setEditForm((prev) => ({ ...prev, content: e.target.value }))
//               }
//               className="border w-full px-2 py-1"
//               rows={6}
//               placeholder="Content"
//             />
//             <div className="mt-2 flex gap-2">
//               <Button onClick={savePost} className="bg-green-500 text-white">
//                 Save
//               </Button>
//               <Button
//                 onClick={cancelEditing}
//                 className="bg-gray-400 text-white"
//               >
//                 Cancel
//               </Button>
//             </div>
//           </>
//         ) : (
//           <>
//             <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
//             <p className="text-gray-700">{post.content}</p>
//             {canEditOrDeletePost && (
//               <div className="mt-2 flex gap-2">
//                 <Button
//                   onClick={startEditing}
//                   className="bg-blue-500 text-white"
//                 >
//                   Edit Post
//                 </Button>
//                 <Button
//                   onClick={handleDeletePost}
//                   className="bg-red-500 text-white"
//                 >
//                   Delete Post
//                 </Button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* COMMENTS */}
//       <div className="space-y-3">
//         <h2 className="text-xl font-semibold">Comments</h2>
//         {comments.length === 0 && (
//           <p className="text-gray-500">No comments yet.</p>
//         )}
//         {comments.map((comment) => (
//           <CommentItem
//             key={comment.id}
//             comment={comment}
//             onEdit={handleEditComment}
//             onDelete={handleDeleteComment}
//           />
//         ))}
//       </div>

//       {/* ADD COMMENT */}
//       <CommentForm postId={id} onAdded={handleAddedComment} />

//   const handleApplyClick = () => {
//     if (!token) {
//       // Redirect to login if not authenticated
//       navigate("/login", { state: { from: `/posts/${id}` } });
//       return;
//     }
//     setShowApplyModal(true);
//   };

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this job posting?")) return;

//     setDeleting(true);
//     try {
//       await deletePost(id);
//       navigate("/");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete post");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   if (!post) return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="animate-pulse space-y-4">
//         <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//         <div className="h-72 bg-gray-200 rounded"></div>
//         <div className="h-10 bg-gray-200 rounded w-3/4"></div>
//       </div>
//     </div>
//   );

//   const isOwner = user && (user.role === "ADMIN" || post.author?.username === user.username);
//   const { location, contract, sections } = parseJobContent(post.content);
//   const authorName = post.author?.username || post.author?.firstName || "Company";

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       {/* Back button */}
//       <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-indigo-600 transition-colors">
//         <ArrowLeft className="h-4 w-4" />
//         Back to Jobs
//       </Link>

//       {/* Main Card */}
//       <Card className="overflow-hidden p-0">
//         {/* Image Header */}
//         {post.imageUrl && (
//           <div className="w-full h-80 overflow-hidden">
//             <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover rounded-t-xl" />
//           </div>
//         )}

//         <CardContent className="p-8">
//           {/* Title Row */}
//           <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
//               {post.createdAt && (
//                 <span className="text-sm text-muted-foreground flex items-center gap-1">
//                   <Calendar className="h-4 w-4" />
//                   Posted {formatRelativeTime(post.createdAt)}
//                 </span>
//               )}
//             </div>

//             <div className="flex gap-2 flex-shrink-0">
//               {isOwner ? (
//                 <>
//                   <Button asChild variant="outline" size="sm">
//                     <Link to={`/edit/${id}`}>
//                       <Pencil className="h-4 w-4 mr-1" />
//                       Edit
//                     </Link>
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={handleDelete}
//                     disabled={deleting}
//                   >
//                     <Trash2 className="h-4 w-4 mr-1" />
//                     {deleting ? "Deleting..." : "Delete"}
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button variant="outline" size="sm">
//                     <Bookmark className="h-4 w-4 mr-1" />
//                     Save
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     <Share2 className="h-4 w-4 mr-1" />
//                     Share
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Job Meta Badges */}
//           <div className="flex flex-wrap gap-3 py-4 mb-6 border-y border-gray-100">
//             <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full">
//               <Building2 className="h-4 w-4" />
//               <span className="font-medium">{authorName}</span>
//             </div>
//             {location && (
//               <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
//                 <MapPin className="h-4 w-4" />
//                 <span className="font-medium">{location}</span>
//               </div>
//             )}
//             {contract && (
//               <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
//                 <Briefcase className="h-4 w-4" />
//                 <span className="font-medium">{contract}</span>
//               </div>
//             )}
//           </div>

//           {/* Job Sections */}
//           <div className="space-y-6">
//             {sections.map((section, idx) => (
//               <div key={idx}>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h3>
//                 <ul className="space-y-2">
//                   {section.items.map((item, itemIdx) => (
//                     <li key={itemIdx} className="flex items-start gap-2 text-gray-700">
//                       <span className="text-indigo-500 mt-1">•</span>
//                       <span>{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>

//           {/* Apply Button */}
//           <div className="mt-8 pt-6 border-t">
//             <Button size="lg" className="w-full md:w-auto px-8" onClick={handleApplyClick}>
//               <Send className="h-4 w-4 mr-2" />
//               Apply for this Position
//             </Button>
//             {!token && (
//               <p className="text-sm text-muted-foreground mt-2">
//                 You need to <Link to="/login" className="text-indigo-600 hover:underline">log in</Link> to apply
//               </p>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Apply Modal */}
//       <ApplyModal
//         isOpen={showApplyModal}
//         onClose={() => setShowApplyModal(false)}
//         jobTitle={post.title}
//         postId={id}
//       />

//       {/* Comments Section */}
//       <Card>
//         <CardContent className="p-6">
//           <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
//           <div className="space-y-4">
//             {comments.length === 0 ? (
//               <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
//             ) : (
//               comments.map((c) => (
//                 <CommentItem key={c.id} comment={c} />
//               ))
//             )}
//           </div>
//           {token && <CommentForm postId={id} onAdded={handleAdded} />}
//         </CardContent>
//       </Card>
//     </div>
//   );
