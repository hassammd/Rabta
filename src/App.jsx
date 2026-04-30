import { Route, Routes } from "react-router";
import "./App.css";
import Auth from "./Pages/Auth";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Layout from "./Components/Layout";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import { useDispatch } from "react-redux";
import { setLoading, setUser } from "./Redux/SignInSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email }));
      } else {
        dispatch(setUser(null));
        dispatch(setLoading(false));
      }
      return () => unsubscribe;
    });
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>

        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
