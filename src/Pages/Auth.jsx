import { useState } from "react";
import SignUp from "../Components/SignUp";
import SignIn from "../Components/SignIn";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <>
      {isLogin ? (
        <SignIn setIsLogin={setIsLogin} />
      ) : (
        <SignUp setIsLogin={setIsLogin} />
      )}
    </>
  );
};
export default Auth;
