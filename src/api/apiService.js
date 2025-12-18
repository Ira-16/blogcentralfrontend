import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8087",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllPosts = () => api.get("/api/posts");
export const getAllArticles = () => api.get("/api/articles");
export const getAllJobs = () => api.get("/api/jobs");
export const getPostById = (id) => api.get(`/api/posts/${id}`);
export const createPost = (data) => api.post("/api/posts", data);
export const deletePost = (id) => api.delete(`/api/posts/${id}`);

export const updatePost = (id, data) =>
  api.put(`/api/posts/${id}`, data);

export const searchPosts = (keyword) =>
  api.get("/search/posts", { params: { keyword } });

export const getCommentsForPost = (postId) =>
  api.get(`/api/posts/${postId}/comments`);
export const addComment = (postId, content) =>
  api.post(`/api/posts/${postId}/comments`, { content });
export const updateComment = (id, comment) =>
  api.put(`/api/comments/${id}`, comment);
export const deleteComment = (id) =>
  api.delete(`/api/comments/${id}`);

// Job Applications
export const submitApplication = (data) =>
  api.post("/api/applications", data);
export const getMyApplications = () =>
  api.get("/api/applications/my");
export const getApplicationsForJob = (jobPostId) =>
  api.get(`/api/applications/job/${jobPostId}`);
export const updateApplicationStatus = (id, status) =>
  api.put(`/api/applications/${id}/status`, { status });
export const deleteApplication = (id) =>
  api.delete(`/api/applications/${id}`);

// Email Subscription
export const subscribe = (email) =>
  api.post("/api/subscribers", { email });
export const unsubscribe = (email) =>
  api.delete("/api/subscribers", { data: { email } });
export const checkSubscription = (email) =>
  api.get("/api/subscribers/check", { params: { email } });
export const verifyEmail = (token) =>
  api.get("/api/subscribers/verify", { params: { token } });

// Categories
export const getCategories = () =>
  api.get("/api/categories");

// Users Management (Admin)
export const getAllUsers = () =>
  api.get("/admin/users");
export const getUserById = (id) =>
  api.get(`/admin/users/${id}`);
export const updateUser = (id, data) =>
  api.put(`/admin/users/${id}`, data);
export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`);

export default api;
