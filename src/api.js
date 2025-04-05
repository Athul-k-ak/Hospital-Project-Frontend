import axios from "axios";
import CONFIG from "./config";

// Base API configuration
const API = axios.create({
  baseURL: `${CONFIG.BASE_URL}/auth`,
  withCredentials: true, // Allow cookies to be sent with requests
});

// API Calls
export const login = (credentials) => API.post("/login", credentials);
export const checkAdmin = () => API.get("/check-admin");
export const logout = () => API.post("/logout");
