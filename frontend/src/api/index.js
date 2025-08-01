import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('adminToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Admin auth
export const sendOtp   = (email) => api.post('/admin/send-otp', { email });
export const verifyOtp = (email, otp) => api.post('/admin/verify-otp', { email, otp });
export const logout    = () => api.post('/admin/logout');

// Blog
export const fetchBlogs   = () => api.get('/blogs');
export const fetchBlog    = (id) => api.get(`/blogs/${id}`);
export const createBlog   = (fd) => api.post('/admin/blogs', fd, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateBlog   = (id, fd) => api.put(`/admin/blogs/${id}`, fd, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteBlog   = (id) => api.delete(`/admin/blogs/${id}`);

// ---------- About ----------
/* ---------- About ---------- */
export const createAbout   = (fd) => api.post('/admin/about', fd, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getAboutAdmin = () => api.get('/admin/about');
export const updateAbout   = (fd) => api.put('/admin/about', fd, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteAbout   = () => api.delete('/admin/about');
export const getAbout      = () => api.get('/about');   // public

/* ---------- Contact ---------- */
export const createContact   = (fd) => api.post('/admin/contact', fd, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getContactAdmin = () => api.get('/admin/contact');
export const updateContact   = (fd) => api.put('/admin/contact', fd, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteContact   = () => api.delete('/admin/contact');
export const getContact      = () => api.get('/contact');   // public