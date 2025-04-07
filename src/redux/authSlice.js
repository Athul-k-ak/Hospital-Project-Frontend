import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const safeParse = (cookie) => {
  try {
    return JSON.parse(cookie);
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: Cookies.get("user") ? safeParse(Cookies.get("user")) : null,
    token: Cookies.get("token") || null,
  },
  reducers: {
    setUser: (state, action) => {
      const user = {
        ...action.payload.user,
        profilePic: action.payload.user.profilePic || "",
      };

      state.user = user;
      state.token = action.payload.token;

      Cookies.set("user", JSON.stringify(user), { expires: 1 });
      Cookies.set("token", action.payload.token, { expires: 1 });
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove("token");
      Cookies.remove("user");
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
