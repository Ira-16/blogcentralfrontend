import { useEffect, useState, useMemo } from "react";
import { getAllJobs } from "@/api/apiService";
import Loader from "@/components/Loader";
import JobCard from "@/components/JobCard";
import { 
  AlertCircle, Briefcase, Search, Filter 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Jobs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter posts based on search term using useMemo
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    return posts.filter(post => 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, posts]);

  useEffect(() => {
    getAllJobs()
      .then((res) => {
        const postsArray = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setPosts(postsArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load job listings");
        setLoading(false);
      });
  }, []);

  const handleDelete = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Loader text="Loading job listings..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <Briefcase className="h-4 w-4" />
            Career Opportunities
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Job Openings
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Find your dream Java developer position at top companies in Belgium & EU
          </p>

          {/* Search & Filter */}
          <div className="max-w-2xl mx-auto flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search jobs by title, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 rounded-xl"
              />
            </div>
            <Button variant="outline" className="rounded-xl px-4">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No jobs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
