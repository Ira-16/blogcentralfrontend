import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../api/apiService";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, MapPin, Clock, FileText, ImagePlus, X, ArrowLeft, Loader2, Tag, Briefcase, Plus } from "lucide-react";

const contractTypes = [
  "Full-time",
  "Part-time",
  "Hybrid",
  "Remote",
  "Internship",
  "Contract",
];

const locations = [
  "Brussels",
  "Antwerp",
  "Ghent",
  "Leuven",
  "Bruges",
  "Belgium",
  "Remote / EU",
];

const categories = [
  "IT Interview Questions",
  "Backend",
  "Frontend",
];

// Parse existing content to extract location and contract (for jobs)
function parseExistingContent(content) {
  if (!content) return { location: "", contractType: "", description: content };
  
  let location = "";
  let contractType = "";
  let description = content;

  const locationMatch = content.match(/\*\*Location:\*\*\s*(.+)/);
  const contractMatch = content.match(/\*\*Contract:\*\*\s*(.+)/);

  if (locationMatch) location = locationMatch[1].trim();
  if (contractMatch) contractType = contractMatch[1].trim();

  // Remove the metadata lines from description
  description = content
    .replace(/\*\*Location:\*\*\s*.+\n?/, "")
    .replace(/\*\*Contract:\*\*\s*.+\n?/, "")
    .trim();

  return { location, contractType, description };
}

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    location: "",
    contractType: "",
    category: "",
    content: "",
    imageUrl: "",
  });
  const [postType, setPostType] = useState(null); // "ARTICLE" or "JOB"
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryList, setCategoryList] = useState(categories);

  // Check if user is Admin
  const isAdmin = user?.role === "ADMIN";
  const isJob = postType === "JOB";

  useEffect(() => {
    getPostById(id)
      .then((res) => {
        const post = res.data;
        setPostType(post.type || "ARTICLE");
        
        if (post.type === "JOB") {
          // Parse job content
          const { location, contractType, description } = parseExistingContent(post.content);
          setForm({
            title: post.title || "",
            location: location,
            contractType: contractType,
            category: post.category?.name || "",
            content: description,
            imageUrl: post.imageUrl || "",
          });
        } else {
          // Article - use content directly
          setForm({
            title: post.title || "",
            location: "",
            contractType: "",
            category: post.category?.name || "",
            content: post.content || "",
            imageUrl: post.imageUrl || "",
          });
        }
        
        if (post.imageUrl) {
          setImagePreview(post.imageUrl);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load post");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setForm((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categoryList.includes(newCategory.trim())) {
      const addedCategory = newCategory.trim();
      setCategoryList((prev) => [...prev, addedCategory]);
      setForm((prev) => ({ ...prev, category: addedCategory }));
      setNewCategory("");
      setShowAddCategory(false);
    }
  };

  const handleUpdate = async () => {
    if (!form.title || !form.content) {
      alert("Title and Description are required");
      return;
    }

    setSaving(true);

    let finalContent = form.content;
    
    // Only add location/contract metadata for jobs
    if (isJob) {
      finalContent = `**Location:** ${form.location || "Belgium"}\n**Contract:** ${form.contractType || "Full-time"}\n\n${form.content}`;
    }

    try {
      await updatePost(id, { 
        title: form.title, 
        content: finalContent,
        imageUrl: form.imageUrl,
        type: postType,
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              Only administrators can edit posts.
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
            <p className="text-muted-foreground">Loading post...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-indigo-600 transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isJob ? (
              <>
                <Briefcase className="h-5 w-5 text-indigo-600" />
                Edit Job Posting
              </>
            ) : (
              <>
                <Pencil className="h-5 w-5 text-indigo-600" />
                Edit Article
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Post Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              {isJob ? "Company Logo / Job Image" : "Article Image"}
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors">
                <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Title *
            </label>
            <Input
              name="title"
              placeholder={isJob ? "e.g. Senior Java Developer" : "e.g. Understanding React Hooks"}
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* Job-specific fields */}
          {isJob && (
            <>
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <select
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select location...</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Contract Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Contract Type
                </label>
                <select
                  name="contractType"
                  value={form.contractType}
                  onChange={handleChange}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select contract type...</option>
                  {contractTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Article-specific fields */}
          {!isJob && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Category
              </label>
              <div className="flex gap-2">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select category...</option>
                  {categoryList.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="h-9 px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Add New Category Input */}
              {showAddCategory && (
                <div className="flex gap-2 mt-2 p-3 bg-gray-50 rounded-lg border">
                  <Input
                    placeholder="New category name..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategory("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Content/Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {isJob ? "Job Description *" : "Article Content *"}
            </label>
            <textarea
              name="content"
              placeholder={isJob 
                ? "Describe the job role, requirements, benefits..." 
                : "Write your article content here..."}
              value={form.content}
              onChange={handleChange}
              rows={10}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={saving}
              className="flex-1"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
