import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  // Use the environment variable, or fallback to the local backend URL for development
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure cookies/credentials are sent with requests if needed for auth
  withCredentials: true,
});

// Optional: Add a request interceptor to attach auth tokens in the future
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('session_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle global errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout on strict 401 Unauthorized (Expired or invalid token)
    // We remove 403 from this check so that WAF blocks or permission errors don't nuke the session
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request. Token expired. Clearing session...');
      const hadToken = !!localStorage.getItem('session_token');
      
      localStorage.removeItem('session_token');
      localStorage.removeItem('session_role');
      localStorage.removeItem('session_user');
      
      // Only redirect if we actually had a token (prevents infinite loops on login screen)
      if (hadToken) {
         window.location.href = '/';
      }
    }
    
    // If error.response is undefined, it's a pure network drop. Do nothing, let the component handle it.
    return Promise.reject(error);
  }
);

export default apiClient;
