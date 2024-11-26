import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:3001", // Replace with your API base URL
});

// Optionally add interceptors for handling auth tokens, errors, etc.
api.interceptors.request.use(
  (config) => {
    // Add token if needed
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status outside of 2xx
      console.error("API error response:", error.response.data);
      console.error("Status code:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // No response received from the server
      console.error("No response received:", error.request);
    } else {
      // Something went wrong in setting up the request
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);
export default api;
