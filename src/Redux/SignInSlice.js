import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth/cordova";
import { auth } from "../../Firebase";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSignIn = createAsyncThunk(
  "atuh/singIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredentials.user;
      return { userid: user.uid, email: user.email };
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }

    console.log(userCredentials);
  },
);

const SignInSlice = createSlice({
  name: "signin",
  initialState,
  reducers: {},
  extraReducers: (builders) => {
    builders.addCase(userSignIn.pending, (state, action) => {
      state.loading = true;
    });
    builders.addCase(userSignIn.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builders.addCase(userSignIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export { userSignIn };
export default SignInSlice.reducer;
