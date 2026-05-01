import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/Auth/state/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
