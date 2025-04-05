import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice"; // ⬅️ Make sure this path is correct
import "../styles/Login.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminExists, setAdminExists] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if an admin exists
    axios
      .get(`${API_BASE_URL}/auth/check-admin`, { withCredentials: true })
      .then((response) => setAdminExists(response.data.adminExists))
      .catch(() => setAdminExists(false));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
  
      const user = response.data.user;
      const token = response.data.token;
  
      console.log("✅ Logged in user:", user);
  
      dispatch(setUser({ user, token })); // ✅ FIXED
  
      setSuccess(true);
  
      setTimeout(() => {
        if (user.role === "admin") navigate("/admin-dashboard");
        else if (user.role === "doctor") navigate("/doctor-dashboard");
        else if (user.role === "reception") navigate("/reception-dashboard");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>Welcome to Hospital Dashboard</h2>
        <p>Manage everything in one place efficiently.</p>
      </div>

      <div className="login-right">
        <h3>Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">Login successful! Redirecting...</div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {!adminExists && (
          <div className="no-admin mt-3 text-center">
            <p>No Admin Found.</p>
            <Link to="/signup" className="btn btn-outline-success">
              Add Admin
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
