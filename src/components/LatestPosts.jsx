import { useEffect, useState } from "react";
import { getAllPosts } from "@/api/apiService";
import PostCard from "@/components/PostCard";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, Briefcase } from "lucide-react";

export default function LatestPosts({ limit = 6 }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllPosts()
      .then((res) => {
        const postsArray = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setPosts(postsArray.slice(0, limit));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load job listings");
        setLoading(false);
      });
  }, [limit]);

  if (loading) {
    return (
      <section id="jobs-section" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Latest Job Openings</h2>
          <Loader text="Loading jobs..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="jobs-section" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Latest Job Openings</h2>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="jobs-section" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <Briefcase className="h-4 w-4" />
            Career Opportunities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Latest Job Openings
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Apply for Java developer positions at top companies in Belgium and the EU
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onDelete={(id) => setPosts(prev => prev.filter(p => p.id !== id))}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link to="/">
              <Briefcase className="h-5 w-5" />
              View All Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
