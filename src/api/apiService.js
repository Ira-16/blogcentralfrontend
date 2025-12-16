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
// Posts
export const getAllPosts = () => api.get("/api/posts");
export const getPostById = (id) => api.get(`/api/posts/${id}`);
export const createPost = (data) => api.post("/api/posts", data);
export const searchPosts = (keyword) =>
  api.get("/search/posts", { params: { keyword } });
export const updatePost = (postId, data) =>
  api.put(`/api/posts/${postId}`, data); // use 'api' instance, not default axios

export const deletePost = (postId) => api.delete(`/api/posts/${postId}`); // also use 'api'

// Comments
export const getCommentsForPost = (postId) =>
  api.get(`/api/posts/${postId}/comments`);
export const addComment = (postId, content) =>
  api.post(`/api/posts/${postId}/comments`, { content });
export const updateComment = (id, comment) =>
  api.put(`/api/comments/${id}`, comment);
export const deleteComment = (id) => api.delete(`/api/comments/${id}`);

// Users
export const getAllUsers = () => api.get("/admin/users");
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const updateUser = (id, userData) =>
  api.put(`/admin/users/${id}`, userData);

export default api;

// ✅ Add these for posts
