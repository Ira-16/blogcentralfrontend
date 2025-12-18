import { useEffect, useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { getApplicationsForJob, deleteApplication } from "@/api/apiService";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  Mail, 
  Phone, 
  User, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  FileText,
  Filter,
  Trash2
} from "lucide-react";
import { formatRelativeTime } from "@/utils/formatDate";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "REVIEWED", label: "Reviewed", color: "bg-blue-100 text-blue-800" },
  { value: "SHORTLISTED", label: "Shortlisted", color: "bg-green-100 text-green-800" },
  { value: "REJECTED", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "HIRED", label: "Hired", color: "bg-purple-100 text-purple-800" },
];

export default function Applications() {
  const { token, user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  // Fetch all jobs first
  useEffect(() => {
    if (!token) return;
    
    api.get("/api/posts")
      .then((res) => {
        const jobsList = Array.isArray(res.data) ? res.data : res.data.data || [];
        setJobs(jobsList);
        if (jobsList.length > 0) {
          setSelectedJob(jobsList[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  // Fetch applications for selected job
  useEffect(() => {
    if (!selectedJob || !token) return;
    
    let isMounted = true;
    
    const fetchApplications = async () => {
      try {
        const res = await getApplicationsForJob(selectedJob);
        if (isMounted) {
          const apps = Array.isArray(res.data) ? res.data : [];
          setApplications(apps);
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchApplications();
    
    return () => { isMounted = false; };
  }, [selectedJob, token]);

  // Download CV as PDF
  const handleDownloadCV = (application) => {
    if (!application.cvBase64) {
      alert("No CV available");
      return;
    }

    // Create download link
    const link = document.createElement("a");
    link.href = application.cvBase64;
    link.download = application.cvFileName || `CV_${application.fullName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // View CV in new tab
  const handleViewCV = (application) => {
    if (!application.cvBase64) {
      alert("No CV available");
      return;
    }
    
    // Open in new tab
    const newWindow = window.open();
    newWindow.document.write(`
      <html>
        <head><title>CV - ${application.fullName}</title></head>
        <body style="margin:0">
          <embed src="${application.cvBase64}" type="application/pdf" width="100%" height="100%" />
        </body>
      </html>
    `);
  };

  // Update application status
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/api/applications/${applicationId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // Delete application
  const handleDelete = async (applicationId, applicantName) => {
    if (!window.confirm(`Are you sure you want to delete the application from "${applicantName}"?`)) {
      return;
    }
    
    try {
      await deleteApplication(applicationId);
      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete application");
    }
  };

  const getStatusBadge = (status) => {
    const option = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${option.color}`}>
        {option.label}
      </span>
    );
  };

  const filteredApplications = filter === "ALL" 
    ? applications 
    : applications.filter((app) => app.status === filter);

  if (!token || (user?.role !== "ADMIN" && user?.role !== "MANAGER")) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
            <p className="text-muted-foreground mt-2">
              You need Admin or Manager privileges to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Job Applications</h1>
          <p className="text-muted-foreground">
            Manage and review applications for your job postings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{applications.length} Applications</span>
        </div>
      </div>

      {/* Job Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select Job</label>
              <select
                value={selectedJob || ""}
                onChange={(e) => setSelectedJob(Number(e.target.value))}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No Applications Yet</h3>
            <p className="text-muted-foreground mt-2">
              Applications for this job will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Applicant Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{app.fullName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Applied {formatRelativeTime(app.appliedAt)}
                        </p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${app.email}`} className="hover:text-indigo-600">
                          {app.email}
                        </a>
                      </div>
                      {app.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${app.phone}`} className="hover:text-indigo-600">
                            {app.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {app.coverLetter && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">Cover Letter:</p>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    {/* CV Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewCV(app)}
                        disabled={!app.cvBase64}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDownloadCV(app)}
                        disabled={!app.cvBase64}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        CV
                      </Button>
                    </div>

                    {/* Status Changer */}
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>

                    {/* Delete Button - Always show for admin, or for rejected applications */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(app.id, app.fullName)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
