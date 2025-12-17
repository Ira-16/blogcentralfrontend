import { useState } from "react";
import { createPost } from "@/api/apiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, FileText, ImagePlus, X } from "lucide-react";

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

export default function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    contractType: "",
    content: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handleSave = async () => {
    if (!form.title || !form.content) {
      alert("Title and Description are required");
      return;
    }

    setLoading(true);

    const jobContent = `**Location:** ${form.location || "Belgium"}\n**Contract:** ${form.contractType || "Full-time"}\n\n${form.content}`;

    try {
      await createPost({ 
        title: form.title, 
        content: jobContent,
        imageUrl: form.imageUrl,
        likes: 0
      });
      nav("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create job posting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            Post a New Job
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Job Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              Job Image (Optional)
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

          {/* Job Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Job Title
            </label>
            <Input
              name="title"
              placeholder="e.g. Junior Java Developer – Spring Boot"
              value={form.title}
              onChange={handleChange}
            />
          </div>

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

          {/* Job Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Description</label>
            <textarea
              name="content"
              placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity great..."
              value={form.content}
              onChange={handleChange}
              rows={8}
              className="w-full border rounded-md p-3 text-sm resize-none"
            />
          </div>

          {/* Submit */}
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Publishing..." : "Publish Job"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
