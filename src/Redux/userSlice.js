import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updatePhoto: (state, action) => {
      if (state.user) {
        state.user.profilePic = action.payload;
      }
    },
  },
});

export const { setUser, updatePhoto } = userSlice.actions;
export default userSlice.reducer;
