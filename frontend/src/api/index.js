import axios from 'axios';

// Create axios instance with base URL and credentials for refresh token cookie
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Initialize access token from localStorage (fallback to memory)
let accessToken = localStorage.getItem('adminToken');

// Request interceptor to attach access token to headers
api.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor to handle token expiration and refresh
api.interceptors.response.use(
  response => response, // Return response directly if no error
  async error => {
    const originalReq = error.config;

    // Check if error is 401 Unauthorized and not already retried
    if (
      error.response?.status === 401 &&
      !originalReq._retry &&
      !originalReq.url.includes('/admin/refresh-token')
    ) {
      originalReq._retry = true;

      try {
        // Attempt to refresh access token
        const res = await axios.post(
          'http://localhost:5000/api/admin/refresh-token',
          {},
          { withCredentials: true }
        );

        accessToken = res.data.token;
        localStorage.setItem('adminToken', accessToken);

        // Update original request with new token and retry it
        originalReq.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalReq);
      } catch (refreshError) {
        // On refresh failure, clear token and reject error
        localStorage.removeItem('adminToken');
        accessToken = null;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/** ======= Admin Authentication APIs ======= */

// Send OTP to admin email for login
export const sendOtp = (email) => api.post('/admin/send-otp', { email });

// Verify OTP and store access token on success
export const verifyOtp = (email, otp) =>
  api.post('/admin/verify-otp', { email, otp }).then(res => {
    accessToken = res.data.token;
    localStorage.setItem('adminToken', accessToken);
    return res;
  });

// Logout admin and clear access token
export const logout = () => {
  accessToken = null;
  localStorage.removeItem('adminToken');
  return api.post('/admin/logout');
};

/** ======= Blog APIs ======= */

export const fetchBlogs = () => api.get('/blogs');
export const fetchBlog = (id) => api.get(`/blogs/${id}`);

export const createBlog = (formData) =>
  api.post('/admin/blogs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateBlog = (id, formData) =>
  api.put(`/admin/blogs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteBlog = (id) => api.delete(`/admin/blogs/${id}`);

/** ======= About APIs ======= */

export const createAbout = (formData) =>
  api.post('/admin/about', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getAboutAdmin = () => api.get('/admin/about');

export const updateAbout = (formData) =>
  api.put('/admin/about', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteAbout = () => api.delete('/admin/about');

export const getAbout = () => api.get('/about');

/** ======= Contact APIs ======= */

export const createContact = (formData) =>
  api.post('/admin/contact', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getContactAdmin = () => api.get('/admin/contact');

export const updateContact = (formData) =>
  api.put('/admin/contact', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteContact = () => api.delete('/admin/contact');

export const getContact = () => api.get('/contact');
