import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Home = () => {
  const { user } = useSelector((state) => state.signIn);

  return (
    <>
      <h1>This is home</h1>
    </>
  );
};

export default Home;
