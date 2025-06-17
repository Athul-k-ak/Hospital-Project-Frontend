import axios from "axios";
import { API_BASE_URL } from "./config";

// Base API configuration
const API = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true,
});


// API Calls
export const login = (credentials) => API.post("/login", credentials);
export const checkAdmin = () => API.get("/check-admin");
export const logout = () => API.post("/logout");
