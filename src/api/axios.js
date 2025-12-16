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
export const getPostById = (id) => api.get(`/api/posts/${id}`);
export const createPost = (data) => api.post("/api/posts", data);
export const searchPosts = (keyword) =>
  api.get("/search/posts", { params: { keyword } });

export const getCommentsForPost = (postId) =>
  api.get(`/api/posts/${postId}/comments`);
export const addComment = (postId, comment) =>
  api.post(`/api/posts/${postId}/comments`, comment);
export const updateComment = (id, comment) =>
  api.put(`/api/comments/${id}`, comment);
export const deleteComment = (id) => api.delete(`/api/comments/${id}`);

export default api;
