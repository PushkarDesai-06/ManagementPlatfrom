import Axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const axios = Axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

// Add request interceptor to include JWT token from localStorage
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("JwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear localStorage and redirect to signin
      localStorage.removeItem("JwtToken");
      if (
        window.location.pathname !== "/signin" &&
        window.location.pathname !== "/signup"
      ) {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
