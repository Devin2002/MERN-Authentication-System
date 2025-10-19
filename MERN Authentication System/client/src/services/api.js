import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Register
  register: (data) => api.post('/api/auth/register', data),
  
  // Login
  login: (data) => api.post('/api/auth/login', data),
  
  // Logout
  logout: () => api.post('/api/auth/logout'),
  
  // Verify email with OTP
  verifyEmail: (otp) => api.post('/api/auth/verify-account', { otp }),
  
  // Send verification OTP
  sendVerifyOtp: () => api.post('/api/auth/send-verify-otp'),
  
  // Check if authenticated
  isAuthenticated: () => api.post('/api/auth/is-auth'),
  
  // Send password reset OTP
  sendResetOtp: (email) => api.post('/api/auth/send-reset-otp', { email }),
  
  // Reset password
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
};

// User API calls
export const userAPI = {
  // Get user data
  getUserData: () => api.get('/api/user/data'),
};

export default api;