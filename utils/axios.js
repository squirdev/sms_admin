import axios from "axios";

const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Use dynamic import to get the store only on the client
axiosApi.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const { store } = await import("../redux/store"); // Import store dynamically
      const { auth } = store.getState(); // Get auth state
      if (auth?.token) {
        config.headers.Authorization = auth.token; // Attach token
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosApi;
