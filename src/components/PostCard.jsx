import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Clock, User, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { deletePost } from "@/api/apiService";
import { useState } from "react";
import { formatRelativeTime } from "@/utils/formatDate";

// Create URL slug from title
function createSlug(title) {
  return title
    ?.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim() || "post";
}

// Extract description from content
function getDescription(content) {
  if (!content) return "";
  const cleanContent = content
    .replace(/\*\*[^*]+:\*\*/g, "")
    .replace(/[#*_~`]/g, "")
    .trim();
  return cleanContent.substring(0, 120);
}

// Estimate reading time
function getReadingTime(content) {
  if (!content) return "2 min";
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// Get gradient color based on category or title
function getCategoryStyle(category, title) {
  const name = category?.name?.toLowerCase() || title?.toLowerCase() || "";
  
  if (name.includes("tech") || name.includes("programming")) {
    return { gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50", text: "text-blue-700" };
  }
  if (name.includes("design") || name.includes("ui")) {
    return { gradient: "from-pink-500 to-rose-600", bg: "bg-pink-50", text: "text-pink-700" };
  }
  if (name.includes("tutorial") || name.includes("guide")) {
    return { gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-700" };
  }
  if (name.includes("news") || name.includes("update")) {
    return { gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50", text: "text-amber-700" };
  }
  
  return { gradient: "from-slate-600 to-slate-800", bg: "bg-slate-100", text: "text-slate-700" };
}

export default function PostCard({ post, onDelete }) {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  
  if (!post) return null;

  const description = getDescription(post.content);
  const readingTime = getReadingTime(post.content);
  const categoryName = post.category?.name || "Article";
  const categoryStyle = getCategoryStyle(post.category, post.title);
  const authorName = post.author?.username || "Anonymous";
  const publishDate = post.createdAt ? formatRelativeTime(post.createdAt) : "Recently";
  
  const isAdmin = user?.role === "ADMIN";

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    setDeleting(true);
    try {
      await deletePost(post.id);
      if (onDelete) onDelete(post.id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit/${post.id}`);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    const slug = createSlug(post.title);
    navigate(`/posts/${post.id}/${slug}`);
  };

  return (
    <article 
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 
                 shadow-sm hover:shadow-lg hover:shadow-gray-200/50
                 transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        {post.imageUrl ? (
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${categoryStyle.gradient} opacity-10`} />
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${categoryStyle.bg} ${categoryStyle.text} backdrop-blur-sm`}>
            {categoryName}
          </span>
        </div>

        {/* Admin Actions */}
        {isAdmin && token && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={handleEdit}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white text-gray-600 hover:text-[#1a1a2e] transition-colors"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 
                       group-hover:text-[#1a1a2e] transition-colors duration-200">
          {post.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {description || "Explore this article to learn more..."}
        </p>

        {/* Footer - Metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Author & Date */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {authorName}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{publishDate}</span>
          </div>
          
          {/* Reading Time & Arrow */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readingTime}
            </span>
            <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#1a1a2e] group-hover:translate-x-0.5 transition-all duration-200" />
          </div>
        </div>
      </div>
    </article>
  );
}
