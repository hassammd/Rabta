import { Route, Routes } from "react-router";
import "./App.css";
import Auth from "./Pages/Auth";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Layout from "./Components/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
