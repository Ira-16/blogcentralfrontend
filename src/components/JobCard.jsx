import { useNavigate } from "react-router-dom";
import { Building2, Pencil, Trash2, MapPin, ArrowRight } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { deletePost } from "@/api/apiService";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Create URL slug from title
function createSlug(title) {
  return title
    ?.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim() || "job";
}

// Get short description (max 80 characters for consistent card height)
function getDescription(content) {
  if (!content) return "";
  const cleanContent = content
    .replace(/\*\*[^*]+:\*\*/g, "")
    .replace(/[#*_~`]/g, "")
    .trim();
  const truncated = cleanContent.substring(0, 80);
  return truncated.length < cleanContent.length ? truncated + "..." : truncated;
}

export default function JobCard({ job, onDelete, compact = false }) {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  
  if (!job) return null;

  const description = getDescription(job.content);
  
  const isAdmin = user?.role === "ADMIN";

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    
    setDeleting(true);
    try {
      await deletePost(job.id);
      if (onDelete) onDelete(job.id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit/${job.id}`);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    const slug = createSlug(job.title);
    navigate(`/jobs/${job.id}/${slug}`);
  };

  // Compact version for FeaturedJobs
  if (compact) {
    return (
      <article 
        onClick={handleCardClick}
        className="group relative bg-white rounded-2xl overflow-hidden
                   shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
                   hover:shadow-[0_8px_30px_-3px_rgba(0,0,0,0.1),0_15px_25px_-2px_rgba(0,0,0,0.06)]
                   transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer"
      >
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {job.imageUrl ? (
            <img 
              src={job.imageUrl} 
              alt={job.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Job Title */}
          <h3 className="text-lg font-bold text-[#1a1a2e] leading-snug mb-2 line-clamp-2 
                         group-hover:text-[#16213e] transition-colors duration-200">
            {job.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5">
            {description || "Apply now and join our team. Great opportunity for career growth and professional development."}
          </p>

          {/* Read More Button */}
          <Button 
            variant="default"
            size="sm"
            className="h-9 px-5 text-sm font-medium bg-[#1a1a2e] hover:bg-[#16213e] text-white rounded-lg transition-all duration-200 hover:shadow-md"
          >
            Read More
          </Button>
        </div>
      </article>
    );
  }

  // Full card version for Jobs page
  return (
    <article 
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl overflow-hidden
                 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
                 hover:shadow-[0_8px_30px_-3px_rgba(0,0,0,0.1),0_15px_25px_-2px_rgba(0,0,0,0.06)]
                 transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {job.imageUrl ? (
          <img 
            src={job.imageUrl} 
            alt={job.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
        )}
        
        {/* Admin Actions */}
        {isAdmin && token && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
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
        {/* Job Title */}
        <h3 className="text-lg font-bold text-[#1a1a2e] leading-snug mb-2 line-clamp-2 
                       group-hover:text-[#16213e] transition-colors duration-200">
          {job.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5">
          {description || "Apply now and join our team. Great opportunity for career growth and professional development."}
        </p>

        {/* Read More Button */}
        <Button 
          variant="default"
          size="sm"
          className="h-9 px-5 text-sm font-medium bg-[#1a1a2e] hover:bg-[#16213e] text-white rounded-lg transition-all duration-200 hover:shadow-md"
        >
          Read More
        </Button>
      </div>
    </article>
  );
}
