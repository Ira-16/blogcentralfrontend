import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPostById, getCommentsForPost, deletePost } from "../api/apiService";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, ArrowLeft, MapPin, Briefcase, Building2, Calendar, Share2, Bookmark, Send } from "lucide-react";
import { formatRelativeTime } from "@/utils/formatDate";
import CommentItem from "../components/CommentItem";
import CommentForm from "../components/CommentForm";
import ApplyModal from "../components/ApplyModal";

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
      // New section header
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
  const { token, user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    getPostById(id).then((res) => setPost(res.data));
    getCommentsForPost(id).then((res) => setComments(res.data));
  }, [id]);

  const handleAdded = (comment) => setComments((prev) => [...prev, comment]);

  const handleApplyClick = () => {
    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { from: `/posts/${id}` } });
      return;
    }
    setShowApplyModal(true);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    
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

  if (!post) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-72 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );

  const isOwner = user && (user.role === "ADMIN" || post.author?.username === user.username);
  const { location, contract, sections } = parseJobContent(post.content);
  const authorName = post.author?.username || post.author?.firstName || "Company";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-indigo-600 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      {/* Main Card */}
      <Card className="overflow-hidden p-0">
        {/* Image Header */}
        {post.imageUrl && (
          <div className="w-full h-80 overflow-hidden">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover rounded-t-xl" />
          </div>
        )}

        <CardContent className="p-8">
          {/* Title Row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
              {post.createdAt && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {formatRelativeTime(post.createdAt)}
                </span>
              )}
            </div>
            
            <div className="flex gap-2 flex-shrink-0">
              {isOwner ? (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/edit/${id}`}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
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
                    <Bookmark className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Job Meta Badges */}
          <div className="flex flex-wrap gap-3 py-4 mb-6 border-y border-gray-100">
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{authorName}</span>
            </div>
            {location && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{location}</span>
              </div>
            )}
            {contract && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
                <Briefcase className="h-4 w-4" />
                <span className="font-medium">{contract}</span>
              </div>
            )}
          </div>

          {/* Job Sections */}
          <div className="space-y-6">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-gray-700">
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
            <Button size="lg" className="w-full md:w-auto px-8" onClick={handleApplyClick}>
              <Send className="h-4 w-4 mr-2" />
              Apply for this Position
            </Button>
            {!token && (
              <p className="text-sm text-muted-foreground mt-2">
                You need to <Link to="/login" className="text-indigo-600 hover:underline">log in</Link> to apply
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
          <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((c) => (
                <CommentItem key={c.id} comment={c} />
              ))
            )}
          </div>
          {token && <CommentForm postId={id} onAdded={handleAdded} />}
        </CardContent>
      </Card>
    </div>
  );
}
