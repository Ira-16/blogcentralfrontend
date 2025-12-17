import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, FileText, CheckCircle } from "lucide-react";
import { submitApplication } from "@/api/apiService";

export default function ApplyModal({ isOpen, onClose, jobTitle, postId }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  });
  const [cvFile, setCvFile] = useState(null);
  const [cvBase64, setCvBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!form.fullName || !form.email || !cvFile) {
      alert("Please fill in all required fields and upload your CV");
      return;
    }

    setLoading(true);
    
    try {
      await submitApplication({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        coverLetter: form.coverLetter,
        cvBase64: cvBase64,
        cvFileName: cvFile.name,
        jobPostId: parseInt(postId),
      });
      
      setSuccess(true);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setForm({ fullName: "", email: "", phone: "", coverLetter: "" });
        setCvFile(null);
        setCvBase64(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Apply for Position</h2>
            <p className="text-sm text-muted-foreground mt-1">{jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          /* Success State */
          <div className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-600 mb-2">Application Submitted!</h3>
            <p className="text-muted-foreground">
              Thank you for applying. We'll review your application and get back to you soon.
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="fullName"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                name="phone"
                type="tel"
                placeholder="+32 XXX XX XX XX"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            {/* CV Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Upload CV (PDF) <span className="text-red-500">*</span>
              </label>
              {cvFile ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-700">{cvFile.name}</p>
                    <p className="text-xs text-green-600">
                      {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setCvFile(null); setCvBase64(null); }}
                    className="p-1 hover:bg-green-100 rounded"
                  >
                    <X className="h-4 w-4 text-green-600" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Click to upload PDF</span>
                  <span className="text-xs text-gray-400">Max 5MB</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Letter (Optional)</label>
              <textarea
                name="coverLetter"
                placeholder="Tell us why you're interested in this position..."
                value={form.coverLetter}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
