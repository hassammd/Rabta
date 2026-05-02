import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth, db } from "../../Firebase";
import { setDoc, doc } from "firebase/firestore";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const signUpUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password, firstName, lastName }, { rejectWithValue }) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredentials.user;
      console.log("this is user", user);
      //   creating user document in fireStore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: firstName,
        lastName: lastName,

        userName: `@${firstName}`,
        email: user.email,
        bio: "Hi Iam using Rabta",
        profilePic: "",
        createAt: new Date().toISOString(),
        followers: [],
        following: [],
      });

      return { userId: user.uid, email: user.email };
    } catch (err) {
      return rejectWithValue(err.message);
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
