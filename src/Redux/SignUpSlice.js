import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth } from "../../Firebase";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const signUpUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredentials.user;
      console.log("this is user", user);
      return { userId: user.uid, email: user.email };
    } catch (err) {
      rejectWithValue(err);
    }
  },
);
const SignUpSlice = createSlice({
  name: "auth/signUp",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUpUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export { signUpUser };

export default SignUpSlice.reducer;
