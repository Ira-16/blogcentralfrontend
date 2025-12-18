import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllArticles } from "@/api/apiService";
import Loader from "@/components/Loader";
import { AlertCircle, BookOpen, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/utils/formatDate";

// Create URL slug from title
function createSlug(title) {
  return (
    title
      ?.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim() || "article"
  );
}

// Get tag color based on category
function getCategoryColor(category) {
  const colors = {
    Frontend: "bg-blue-100 text-blue-700",
    Backend: "bg-green-100 text-green-700",
    "IT Interview Questions": "bg-purple-100 text-purple-700",
    General: "bg-slate-100 text-slate-700",
  };
  return colors[category] || "bg-slate-100 text-slate-700";
}

export default function FeaturedArticles({ limit = 6 }) {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllArticles()
      .then((res) => {
        const articlesArray = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        setArticles(articlesArray.slice(0, limit));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load articles");
        setLoading(false);
      });
  }, [limit]);

  const handleCardClick = (article) => {
    const slug = createSlug(article.title);
    navigate(`/posts/${article.id}/${slug}`);
  };

  if (loading) {
    return (
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              <BookOpen className="h-4 w-4" />
              Featured Articles
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Latest Blog Posts
            </h2>
          </div>
          <Loader text="Loading articles..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            Featured Articles
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our latest articles and tutorials on web development
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={() => handleCardClick(article)}
              className="group block cursor-pointer"
            >
              <div className="bg-white rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100">
                {/* Image Placeholder */}
                <div className="bg-linear-to-br from-indigo-50 to-slate-100 rounded-xl aspect-16/10 flex items-center justify-center mb-4 overflow-hidden">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-12 w-12 text-indigo-300" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  {/* Category Tag */}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                      article.categoryName
                    )}`}
                  >
                    {article.categoryName}
                  </span>

                  {/* Title */}
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {article.content?.substring(0, 120)}...
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                    <span>By {article.authorUsername}</span>
                    <span>{formatRelativeTime(article.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button
            onClick={() => navigate("/posts")}
            className="bg-[#1a1a2e] text-white hover:bg-[#2d2d44] rounded-full px-8 h-12 text-base font-medium transition-all duration-200"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            View All Articles
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
