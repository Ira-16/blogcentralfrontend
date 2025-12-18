import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchPosts, getAllPosts } from "../api/apiService";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { Search, AlertCircle } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery();
  const keyword = query.get("keyword");
  const [results, setResults] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!keyword) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isMounted = true; // track if component is still mounted
    setLoading(true);
    setError(null);

    const fetchResults = async () => {
      try {
        const res = await searchPosts(keyword);
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        if (isMounted) {
          setResults(data);
        }
      } catch {
        // fallback to client-side filtering
        try {
          const res = await getAllPosts();
          const allPosts = Array.isArray(res.data)
            ? res.data
            : res.data.data || [];
          const filtered = allPosts.filter(
            (post) =>
              post.title?.toLowerCase().includes(keyword.toLowerCase()) ||
              post.content?.toLowerCase().includes(keyword.toLowerCase()) ||
              post.authorUsername?.toLowerCase().includes(keyword.toLowerCase())
          );
          if (isMounted) {
            setResults(filtered);
          }
        } catch (err) {
          console.error(err);
          if (isMounted) {
            setError("An error occurred while searching. Please try again.");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false; // cancel updates if component unmounts
    };
  }, [keyword]);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="h-6 w-6 text-[#1a1a2e]" />
            <h1 className="text-2xl font-bold text-[#1a1a2e]">
              Search Results
            </h1>
          </div>
          <p className="text-gray-600">
            Search for:{" "}
            <span className="font-semibold text-[#1a1a2e]">"{keyword}"</span>
            {results.length > 0 && (
              <span className="ml-2">
                – {results.length} {results.length === 1 ? "result" : "results"}{" "}
                found
              </span>
            )}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 mb-6">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          !error && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Results Found
              </h2>
              <p className="text-gray-500">No results matching "{keyword}"</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
