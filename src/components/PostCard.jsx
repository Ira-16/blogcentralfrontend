import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Code, Briefcase, Database, Server, Globe, Cpu, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { deletePost } from "@/api/apiService";
import { useState } from "react";

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
  return cleanContent.substring(0, 100);
}

// Estimate reading time
function getReadingTime(content) {
  if (!content) return "1-6 min read";
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes}-${minutes + 5} min read`;
}

// Get icon and color based on title
function getIconAndColor(title) {
  const titleLower = title?.toLowerCase() || "";
  
  if (titleLower.includes("spring") || titleLower.includes("boot")) {
    return { Icon: Server, color: "from-green-500 to-emerald-500", bgLight: "bg-green-50" };
  }
  if (titleLower.includes("backend") || titleLower.includes("microservice")) {
    return { Icon: Database, color: "from-purple-500 to-violet-500", bgLight: "bg-purple-50" };
  }
  if (titleLower.includes("frontend") || titleLower.includes("web")) {
    return { Icon: Globe, color: "from-cyan-500 to-blue-500", bgLight: "bg-cyan-50" };
  }
  if (titleLower.includes("fintech") || titleLower.includes("finance")) {
    return { Icon: Code, color: "from-orange-500 to-red-500", bgLight: "bg-orange-50" };
  }
  if (titleLower.includes("software") || titleLower.includes("engineer")) {
    return { Icon: Cpu, color: "from-pink-500 to-rose-500", bgLight: "bg-pink-50" };
  }
  if (titleLower.includes("trainee") || titleLower.includes("intern")) {
    return { Icon: Briefcase, color: "from-blue-500 to-indigo-500", bgLight: "bg-blue-50" };
  }
  if (titleLower.includes("java") || titleLower.includes("developer")) {
    return { Icon: Code, color: "from-orange-500 to-red-500", bgLight: "bg-orange-50" };
  }
  
  return { Icon: Briefcase, color: "from-indigo-500 to-purple-500", bgLight: "bg-indigo-50" };
}

export default function PostCard({ post, onDelete }) {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  
  if (!post) return null;

  const description = getDescription(post.content);
  const readingTime = getReadingTime(post.content);
  const categoryName = post.category?.name || "General";
  const { Icon, color, bgLight } = getIconAndColor(post.title);
  
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

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1 relative">
      {/* Admin Actions */}
      {isAdmin && token && (
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handleEdit}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-indigo-50 text-indigo-600 transition-colors"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Icon & Tag */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgLight} text-slate-700`}>
          {categoryName}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
        {post.title}
      </h3>
      <p className="text-slate-600 mb-4 line-clamp-2">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="h-4 w-4" />
          <span>{readingTime}</span>
        </div>
        <Link 
          to={`/posts/${post.id}/${createSlug(post.title)}`}
          className="inline-flex items-center gap-1 text-indigo-600 font-medium text-sm hover:gap-2 transition-all"
        >
          Read More
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
