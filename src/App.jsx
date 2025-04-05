import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/authSlice";
import axios from "axios";
import Cookies from "js-cookie";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          dispatch(setUser({ user: res.data, token }));
        } catch (error) {
          console.error("Failed to fetch user:", error);
          dispatch(clearUser());
        }
      }
    };

    fetchUser();
  }, [dispatch, token]);

  return <AppRoutes />;
};

export default App;
