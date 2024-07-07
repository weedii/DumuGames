import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : null,
};

const userSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
      localStorage.setItem("cartItems", []);
    },

    signOut: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
      localStorage.setItem("cartItems", []);
    },

    updateUser: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },

    deleteUser: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { signIn, signOut, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
