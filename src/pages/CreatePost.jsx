import { useState } from "react";
import { createPost } from "@/api/apiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, FileText, ImagePlus, X, BookOpen, Tag, Plus } from "lucide-react";

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

const defaultCategories = [
  "IT Interview Questions",
  "Backend",
  "Frontend",
];

export default function CreatePost() {
  const [postType, setPostType] = useState(null); // null = selection screen, "ARTICLE" or "JOB"
  const [form, setForm] = useState({
    title: "",
    location: "",
    contractType: "",
    category: "",
    content: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryList, setCategoryList] = useState(defaultCategories);
  const nav = useNavigate();

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

  const handleSave = async () => {
    if (!form.title || !form.content) {
      alert("Title and Content are required");
      return;
    }

    setLoading(true);

    let finalContent = form.content;
    
    // Only add location/contract metadata for jobs
    if (postType === "JOB") {
      finalContent = `**Location:** ${form.location || "Belgium"}\n**Contract:** ${form.contractType || "Full-time"}\n\n${form.content}`;
    }

    try {
      await createPost({ 
        title: form.title, 
        content: finalContent,
        imageUrl: form.imageUrl,
        type: postType,
        likes: 0
      });
      nav(postType === "JOB" ? "/jobs" : "/posts");
    } catch (err) {
      console.error(err);
      alert(`Failed to create ${postType === "JOB" ? "job posting" : "article"}`);
    } finally {
      setLoading(false);
    }
  };

  // Type Selection Screen
  if (!postType) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
          <p className="text-gray-600">What would you like to create?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Article Option */}
          <Card 
            className="cursor-pointer hover:border-indigo-500 hover:shadow-lg transition-all group"
            onClick={() => setPostType("ARTICLE")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Write an Article</h2>
              <p className="text-gray-600 text-sm">
                Share your knowledge, tutorials, tips, or tech insights with the community
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">Tutorial</span>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">Guide</span>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">Tips</span>
              </div>
            </CardContent>
          </Card>

          {/* Job Option */}
          <Card 
            className="cursor-pointer hover:border-green-500 hover:shadow-lg transition-all group"
            onClick={() => setPostType("JOB")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Post a Job</h2>
              <p className="text-gray-600 text-sm">
                Recruit talented developers by posting job opportunities
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">Full-time</span>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">Remote</span>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">Contract</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isJob = postType === "JOB";

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Back to selection */}
      <button 
        onClick={() => setPostType(null)}
        className="text-sm text-gray-500 hover:text-indigo-600 mb-4 flex items-center gap-1"
      >
        ← Back to selection
      </button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isJob ? (
              <>
                <Briefcase className="h-5 w-5 text-green-600" />
                Post a New Job
              </>
            ) : (
              <>
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Write a New Article
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              {isJob ? "Company Logo / Job Image (Optional)" : "Article Cover Image (Optional)"}
            </label>
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition-colors">
                <ImagePlus className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Click to upload image</span>
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
              {isJob ? "Job Title *" : "Article Title *"}
            </label>
            <Input
              name="title"
              placeholder={isJob ? "e.g. Junior Java Developer – Spring Boot" : "e.g. Understanding React Hooks"}
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
                  className="w-full border rounded-md p-2 text-sm"
                >
                  <option value="">Select Location</option>
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
                  className="w-full border rounded-md p-2 text-sm"
                >
                  <option value="">Select Contract Type</option>
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
                  className="flex-1 border rounded-md p-2 text-sm"
                >
                  <option value="">Select Category</option>
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
            <label className="text-sm font-medium">
              {isJob ? "Job Description *" : "Article Content *"}
            </label>
            <textarea
              name="content"
              placeholder={isJob 
                ? "Describe the role, responsibilities, requirements, and what makes this opportunity great..." 
                : "Write your article content here. Share your knowledge, insights, and expertise..."}
              value={form.content}
              onChange={handleChange}
              rows={10}
              className="w-full border rounded-md p-3 text-sm resize-none"
            />
          </div>

          {/* Submit */}
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className={`w-full ${isJob ? "bg-green-600 hover:bg-green-700" : ""}`}
          >
            {loading ? "Publishing..." : (isJob ? "Publish Job" : "Publish Article")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
