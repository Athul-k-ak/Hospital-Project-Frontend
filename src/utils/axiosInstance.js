import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://hospital-project-backend-2.onrender.com/api",
  withCredentials: true, // ✅ Always send cookies
});

export default axiosInstance;
