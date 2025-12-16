import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchPosts } from "../api/apiService";
import PostCard from "../components/PostCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery();
  const keyword = query.get("keyword");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (keyword) {
      searchPosts(keyword).then((res) => setResults(res.data));
    }
  }, [keyword]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl">Results for "{keyword}"</h2>
      {results.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
