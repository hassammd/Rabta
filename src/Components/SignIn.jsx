import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSignIn } from "../Redux/SignInSlice";
import { useNavigate } from "react-router";

const SignIn = ({ setIsLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errrs, setErrors] = useState({});
  const { user } = useSelector((state) => state.signIn);
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
      <div className="lg:w-1/3 w-full lg:py-12 p-5 mx-auto">
        <h1 className="font-bold text-center">Rabta</h1>
        <div className="border border-gray-100 bg-white shadow-2xl lg:py-22 lg:px-20 p-8 flex flex-col gap-3.5">
          <form
            onSubmit={submitHandler}
            action=""
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm">Email</label>
              <input
                className={`lg:p-2 p-1 border outline-0 ${errrs.email ? "border-error" : "border-gray-200"}  rounded-lg`}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-sm text-red-600">{errrs.email}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm">Password</label>
              <input
                className={`lg:p-2 p-1 border outline-0 ${errrs.password ? "border-error" : "border-gray-200"}  rounded-lg`}
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-sm text-red-600">{errrs.password}</p>
            </div>

            <p className="text-sm text-red-600"></p>

            <div className="flex flex-col gap-1">
              <input
                className="bg-[#3B82F6] text-white uppercase cursor-pointer lg:p-2 p-1 border outline-0 border-gray-200 rounded-lg"
                type="submit"
                value={"login"}
              />
            </div>
          </form>
          <button
            onClick={() => setIsLogin(false)}
            className="cursor-pointer lg:p-2 p-1 border outline-0 border-gray-200 rounded-lg"
          >
            Create new account
          </button>
        </div>
      </div>
    </>
  );
};

export default SignIn;
