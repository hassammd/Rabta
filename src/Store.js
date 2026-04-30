import { configureStore } from "@reduxjs/toolkit";
import SignUpSlice from "./Redux/SignUpSlice";
import SignInSlice from "./Redux/SignInSlice";

export const Store = configureStore({
  reducer: {
    signUp: SignUpSlice,
    signIn: SignInSlice,
  },
});
