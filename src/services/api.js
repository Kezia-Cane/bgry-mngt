import axios from 'axios';

// Get the API URL from environment variables (defaults for development)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add a timeout to prevent hanging requests
  timeout: 30000, // 30 seconds
});

// Simple in-memory cache
const cache = {
  data: {},
  timestamp: {},
  // Cache expiration time in milliseconds (5 minutes)
  expirationTime: 5 * 60 * 1000
};

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    // Attempt to get the token from localStorage
    const token = localStorage.getItem('authToken'); // Ensure key matches where you store it
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Check if we should use cached data for GET requests
    if (config.method === 'get' && config.useCache !== false) {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedData = cache.data[cacheKey];
      const timestamp = cache.timestamp[cacheKey];

      // Use cached data if it exists and hasn't expired
      if (cachedData && timestamp && (Date.now() - timestamp < cache.expirationTime)) {
        // Set a flag to use cached data
        config.adapter = () => {
          return Promise.resolve({
            data: cachedData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {}
          });
        };
      }
    }

    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Add a response interceptor for caching and error handling
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get' && response.config.useCache !== false) {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      cache.data[cacheKey] = response.data;
      cache.timestamp[cacheKey] = Date.now();
    }
    return response;
  },
  (error) => {
    // Handle network errors or timeouts
    if (!error.response) {
      console.error('Network error or timeout:', error.message);
      // You could dispatch a notification here
    }
    // Handle 401 Unauthorized errors
    else if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - possibly token expired:", error.response.data);
    }
    // Handle 404 Not Found errors
    else if (error.response && error.response.status === 404) {
      console.error("Resource not found:", error.response.data);
      // You could handle redirects for 404s here
    }
    return Promise.reject(error);
  }
);

// Helper function to clear cache
api.clearCache = () => {
  cache.data = {};
  cache.timestamp = {};
};

// Helper function to clear specific cache entry
api.clearCacheFor = (url, params = {}) => {
  const cacheKey = `${url}${JSON.stringify(params)}`;
  delete cache.data[cacheKey];
  delete cache.timestamp[cacheKey];
};

export default api;
