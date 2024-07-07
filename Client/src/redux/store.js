import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import CartReducer from "./CartSlice";

export const store = configureStore({
  reducer: {
    currentUser: userReducer,
    Cart: CartReducer,
  },
  devTools: true,
});
