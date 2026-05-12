import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allUsers: [],
  allusersPosts: [],
  allUsersPostisIds: {},
};

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    allUsersPosts: (state, action) => {
      state.allusersPosts = action.payload;
    },
    allUsersPostisIds: (state, action) => {
      state.allUsersPostisIds = action.payload;
    },
  },
});

export const { setAllUsers, allUsersPosts, allUsersPostisIds } =
  allUsersSlice.actions;
export default allUsersSlice.reducer;
