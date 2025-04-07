import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./redux/authSlice";
import AppRoutes from "./routes/AppRoutes";
import axios from "./utils/axiosInstance"; // using custom instance

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/profile", {
          withCredentials: true, // ✅ Ensure cookies are sent
        });

        dispatch(
          setUser({
            user: {
              id: res.data.id,
              name: res.data.name,
              email: res.data.email,
              role: res.data.role,
              profilePic: res.data.profileImage || "", // 🔁 Ensure consistency
            },
            token: "", // Optional: You can leave token blank as you're using cookies
          })
        );
      } catch (error) {
        console.error("User not authenticated:", error.response?.data || error.message);
        dispatch(clearUser());
      }
    };

    fetchUser();
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;
