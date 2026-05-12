import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  loading: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
    updateProfileImage: (state, action) => {
      if (state.user) {
        state.user.profilePic = action.payload;
      }
    },
    updateBannerImage: (state, action) => {
      state.user.bannerPic = action.payload;
    },
    // userPosts: (state, action)=>{

    // }
  },
});

export const { setUser, updateProfileImage, updateBannerImage, loading } =
  userSlice.actions;
export default userSlice.reducer;
