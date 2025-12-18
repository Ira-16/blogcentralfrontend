import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllJobs } from "@/api/apiService";
import Loader from "@/components/Loader";
import JobCard from "@/components/JobCard";
import { 
  AlertCircle, Briefcase, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeaturedJobs({ limit = 4 }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllJobs()
      .then((res) => {
        const jobsArray = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        
        setJobs(jobsArray.slice(0, limit));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load jobs");
        setLoading(false);
      });
  }, [limit]);

  if (loading) {
    return (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-full text-sm font-medium mb-4">
              <Briefcase className="h-4 w-4" />
              Career Opportunities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Job Openings
            </h2>
          </div>
          <Loader text="Loading jobs..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-full text-sm font-medium mb-4">
            <Briefcase className="h-4 w-4" />
            Career Opportunities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Job Openings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Apply for developer positions at top companies in Belgium and the EU
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              compact={true}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button 
            onClick={() => navigate("/jobs")}
            className="bg-[#1a1a2e] text-white hover:bg-[#2d2d44] rounded-full px-8 h-12 text-base font-medium transition-all duration-200"
          >
            <Briefcase className="h-5 w-5 mr-2" />
            View All Jobs
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
