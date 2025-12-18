import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAllArticles, getCategories } from "@/api/apiService";
import Loader from "@/components/Loader";
import { AlertCircle, ArrowUpRight, ImageIcon, BookOpen, Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  return cleanContent.substring(0, 120);
}

// Estimate reading time
function getReadingTime(content) {
  if (!content) return "5 min read";
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export default function AllPosts() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get category from URL
  const selectedCategory = searchParams.get("category") || "";

  const filteredPosts = useMemo(() => {
    let result = posts;
    
    // Filter by category if selected
    if (selectedCategory) {
      result = result.filter(post => 
        post.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result;
  }, [searchTerm, posts, selectedCategory]);

  useEffect(() => {
    // Fetch categories
    getCategories()
      .then((res) => {
        const cats = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCategories(cats);
      })
      .catch(() => {});

    // Fetch posts
    getAllArticles()
      .then((res) => {
        const postsArray = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setPosts(postsArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load articles");
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (categoryName) => {
    if (categoryName) {
      setSearchParams({ category: categoryName });
    } else {
      setSearchParams({});
    }
  };

  const clearCategory = () => {
    setSearchParams({});
  };

  const handleCardClick = (post) => {
    const slug = createSlug(post.title);
    navigate(`/posts/${post.id}/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Loader text="Loading articles..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
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
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            Blog Articles
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {selectedCategory ? selectedCategory : "All Articles"}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            {selectedCategory 
              ? `Browsing articles in ${selectedCategory} category`
              : "Explore our collection of tutorials, guides, and tech articles"
            }
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <Button
              variant={!selectedCategory ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick("")}
              className={`rounded-full ${!selectedCategory ? "bg-[#1a1a2e] text-white" : ""}`}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.name ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(cat.name)}
                className={`rounded-full ${selectedCategory === cat.name ? "bg-[#1a1a2e] text-white" : ""}`}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Selected Category Badge */}
          {selectedCategory && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                <Filter className="h-4 w-4" />
                Filtered by: {selectedCategory}
                <button 
                  onClick={clearCategory}
                  className="hover:bg-indigo-100 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            </div>
          )}

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 rounded-xl"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No articles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => handleCardClick(post)}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1">
                  {/* Image */}
                  <div className="bg-slate-100 rounded-xl aspect-[16/10] flex items-center justify-center mb-4 overflow-hidden">
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-slate-300" strokeWidth={1.5} />
                    )}
                  </div>

                  {/* Author & Read Time */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <span className="text-indigo-600 font-medium">{post.authorUsername || "Author"}</span>
                    <span className="text-slate-300">•</span>
                    <span>{getReadingTime(post.content)}</span>
                  </div>

                  {/* Title with Arrow */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {getDescription(post.content)}
                  </p>

                  {/* Category & Date */}
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full">
                      {post.categoryName || "General"}
                    </span>
                    <span className="text-sm text-slate-400">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
