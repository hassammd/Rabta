import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSignIn } from "../Redux/SignInSlice";
import { useNavigate } from "react-router";
import { LuEye, LuEyeClosed } from "react-icons/lu";

const SignIn = ({ setIsLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errrs, setErrors] = useState({});
  const { user } = useSelector((state) => state.signIn);
  const [showPassword, setShowPassword] = useState(false);

  console.log("show password", showPassword);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email.trim()) {
      newErrors.email = "Enter your email";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter valid Email";
    }
    if (!password.trim()) {
      newErrors.password = "Enter Your Password";
    }
    if (Object.entries(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setEmail("");
      setPassword("");
      setErrors({});
      dispatch(userSignIn({ email, password }));
      navigate("/");
    }
  };
  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-1/2 w-full lg:py-12  mx-auto">
        <h1 className="font-bold text-center text-2xl">Sign in to Rabta</h1>
        <div className="    lg:py-22 lg:px-20 p-8 flex flex-col gap-3.5">
          <form
            onSubmit={submitHandler}
            action=""
            className="flex flex-col lg:gap-5 gap-3"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm lg:px-4 ">Email</label>
              <input
                className={`lg:px-4 lg:py-2 p-1 border outline-0 ${errrs.email ? "border-error" : "border-gray-200"}   rounded-full`}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-sm text-red-600">{errrs.email}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm lg:px-4 ">Password</label>
              <div className="relative">
                <input
                  className={`lg:px-4 lg:py-2 p-1 w-full border outline-0 ${errrs.password ? "border-error" : "border-gray-200"}    rounded-full`}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute top-3 right-3 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <LuEyeClosed /> : <LuEye />}
                </span>
              </div>
              <p className="text-sm text-red-600">{errrs.password}</p>
            </div>

            <p className="text-sm text-red-600"></p>

            <div className="flex flex-col gap-1">
              <input
                className="bg-[#3B82F6] text-white uppercase cursor-pointer lg:p-2 p-1 border outline-0 border-gray-200  rounded-full"
                type="submit"
                value={"login"}
              />
            </div>
          </form>
          <p className="text-center">
            Don't have an account?
            <span
              className="text-blue-600 ml-2 cursor-pointer"
              onClick={() => setIsLogin(false)}
            >
              Sign up
            </span>
          </p>
          {/* <button className="cursor-pointer lg:p-2 p-1 border outline-0 border-gray-200  rounded-full">
            Create new account
          </button> */}
        </div>
      </div>
    </>
  );
};

export default SignIn;
