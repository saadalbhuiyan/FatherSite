import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // ⬅️ send refresh token cookie
});

// Store access token in memory (fallback to localStorage if page reloads)
let accessToken = localStorage.getItem('adminToken');

// Set Authorization header before each request
api.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  res => res,
  async err => {
    const originalReq = err.config;

    // If token expired and not already retried
    if (
      err.response?.status === 401 &&
      !originalReq._retry &&
      !originalReq.url.includes('/admin/refresh-token')
    ) {
      originalReq._retry = true;

      try {
        const res = await axios.post(
          'http://localhost:5000/api/admin/refresh-token',
          {},
          { withCredentials: true }
        );

        accessToken = res.data.token;
        localStorage.setItem('adminToken', accessToken);
        originalReq.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalReq); // Retry original request
      } catch (refreshErr) {
        localStorage.removeItem('adminToken');
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

// Admin Auth APIs
export const sendOtp = (email) => api.post('/admin/send-otp', { email });
export const verifyOtp = (email, otp) =>
  api.post('/admin/verify-otp', { email, otp }).then(res => {
    accessToken = res.data.token;
    localStorage.setItem('adminToken', accessToken);
    return res;
  });

export const logout = () => {
  accessToken = null;
  localStorage.removeItem('adminToken');
  return api.post('/admin/logout');
};

// Blog APIs
export const fetchBlogs = () => api.get('/blogs');
export const fetchBlog = (id) => api.get(`/blogs/${id}`);
export const createBlog = (fd) => api.post('/admin/blogs', fd, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateBlog = (id, fd) => api.put(`/admin/blogs/${id}`, fd, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteBlog = (id) => api.delete(`/admin/blogs/${id}`);

// About APIs
export const createAbout = (fd) => api.post('/admin/about', fd, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getAboutAdmin = () => api.get('/admin/about');
export const updateAbout = (fd) => api.put('/admin/about', fd, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteAbout = () => api.delete('/admin/about');
export const getAbout = () => api.get('/about');

// Contact APIs
export const createContact = (fd) => api.post('/admin/contact', fd, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getContactAdmin = () => api.get('/admin/contact');
export const updateContact = (fd) => api.put('/admin/contact', fd, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteContact = () => api.delete('/admin/contact');
export const getContact = () => api.get('/contact');
