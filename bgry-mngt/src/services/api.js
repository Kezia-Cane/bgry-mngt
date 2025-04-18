import axios from 'axios';

// Get the API URL from environment variables (defaults for development)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    // Attempt to get the token from localStorage
    const token = localStorage.getItem('authToken'); // Ensure key matches where you store it
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for handling common errors like 401
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., token expired or invalid)
      console.error("Unauthorized access - possibly token expired:", error.response.data);
      // Optionally: Force logout the user
      // localStorage.removeItem('authToken');
      // localStorage.removeItem('userInfo');
      // window.location.href = '/login'; // Force redirect
    }
    return Promise.reject(error);
  }
);


export default api;
