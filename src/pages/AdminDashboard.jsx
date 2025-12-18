import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import api from "@/api/axios";
import { 
  Users, 
  FileText, 
  Briefcase, 
  ClipboardList,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  ArrowRight,
  Plus,
  Settings,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/Loader";

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || (user?.role !== "ADMIN" && user?.role !== "MANAGER")) {
      navigate("/");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [usersRes, postsRes] = await Promise.all([
          api.get("/admin/users").catch(() => ({ data: [] })),
          api.get("/api/posts").catch(() => ({ data: [] })),
        ]);

        const users = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data?.data || [];
        const posts = Array.isArray(postsRes.data) ? postsRes.data : postsRes.data?.data || [];
        
        // Separate articles and jobs
        const articles = posts.filter(p => p.type === "ARTICLE");
        const jobs = posts.filter(p => p.type === "JOB");

        // Fetch applications for all jobs
        let allApplications = [];
        for (const job of jobs.slice(0, 20)) {
          try {
            const appRes = await api.get(`/api/applications/job/${job.id}`);
            const apps = Array.isArray(appRes.data) ? appRes.data : [];
            allApplications = [...allApplications, ...apps.map(app => ({ ...app, jobTitle: job.title }))];
          } catch {
            // Ignore failed requests for individual jobs
          }
        }

        const pendingCount = allApplications.filter(a => a.status === "PENDING").length;

        setStats({
          totalUsers: users.length,
          totalPosts: articles.length,
          totalJobs: jobs.length,
          totalApplications: allApplications.length,
          pendingApplications: pendingCount,
        });

        // Get recent applications (last 5)
        setRecentApplications(
          allApplications
            .sort((a, b) => new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt))
            .slice(0, 5)
        );

        setLoading(false);
      } catch (error) {
        console.error("Dashboard error:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <Loader text="Loading dashboard..." />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      link: "/manage-users",
    },
    {
      title: "Articles",
      value: stats.totalPosts,
      icon: FileText,
      color: "bg-green-500",
      link: "/posts",
    },
    {
      title: "Job Listings",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "bg-purple-500",
      link: "/jobs",
    },
    {
      title: "Applications",
      value: stats.totalApplications,
      icon: ClipboardList,
      color: "bg-orange-500",
      link: "/applications",
      badge: stats.pendingApplications > 0 ? `${stats.pendingApplications} pending` : null,
    },
  ];

  const quickActions = [
    {
      title: "Create Article",
      description: "Write and publish a new article",
      icon: FileText,
      action: () => navigate("/create"),
      color: "text-green-600",
    },
    {
      title: "Add Job Listing",
      description: "Post a new job opportunity",
      icon: Briefcase,
      action: () => navigate("/create"),
      color: "text-purple-600",
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      action: () => navigate("/manage-users"),
      color: "text-blue-600",
    },
    {
      title: "Review Applications",
      description: "Process job applications",
      icon: ClipboardList,
      action: () => navigate("/applications"),
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#1a1a2e] rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome back, {user?.username}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              onClick={() => navigate(stat.link)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-[#1a1a2e]">{stat.value}</p>
                    {stat.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {stat.badge}
                      </span>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-gray-100 ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-[#1a1a2e]">{action.title}</p>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#1a1a2e] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Applications
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/applications")}
                  className="text-sm"
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentApplications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No applications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentApplications.map((app, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1a1a2e] flex items-center justify-center text-white font-semibold text-sm">
                          {app.fullName?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div>
                          <p className="font-medium text-[#1a1a2e] text-sm">{app.fullName || "Applicant"}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{app.jobTitle || "Job"}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                        app.status === "REVIEWED" ? "bg-blue-100 text-blue-800" :
                        app.status === "SHORTLISTED" ? "bg-green-100 text-green-800" :
                        app.status === "REJECTED" ? "bg-red-100 text-red-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
