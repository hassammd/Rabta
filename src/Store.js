import { configureStore } from "@reduxjs/toolkit";
import SignUpSlice from "./Redux/SignUpSlice";
import SignInSlice from "./Redux/SignInSlice";
import userSlice from "./Redux/userSlice";
import allUsersSlice from "./Redux/allUsersSlice";

export const Store = configureStore({
  reducer: {
    signUp: SignUpSlice,
    signIn: SignInSlice,
    user: userSlice,
    allUsers: allUsersSlice,
  },
});
