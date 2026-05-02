import { useState } from "react";
import { useDispatch } from "react-redux";
import { signUpUser } from "../Redux/SignUpSlice";
import { last } from "firebase/firestore/pipelines";
import { useNavigate } from "react-router";

const SignUp = ({ setIsLogin }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(errors);

  const SubmitHandler = (e) => {
    e.preventDefault();
    let newError = {};
    if (!firstName.trim()) {
      newError.firstName = "Enter first name";
    }
    if (!lastName.trim()) {
      newError.lastName = "Enter your last name";
    }
    if (!day.trim()) {
      newError.day = "Select day";
    }
    if (!month.trim()) {
      newError.month = "Select your month";
    }
    if (!year.trim()) {
      newError.year = "Select your year";
    }
    if (!gender) {
      newError.gender = "select your gender";
    }
    const emailRegexm = /^\S+@\S+\.\S+$/;
    if (!email.trim()) {
      newError.email = "Enter your Email";
    } else if (!emailRegexm.test(email)) {
      newError.email = "Enter valid email";
    }
    if (!phone.trim()) {
      newError.phone = "Enter your phone";
    }
    if (!password.trim()) {
      newError.password = "Enter your password";
    }
    if (password.length < 6) {
      newError.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword.trim()) {
      newError.confirmPassword = "Enter your confirmPassword";
    }
    if (password !== confirmPassword) {
      newError.passwordNotMatch = "Password not match";
    }
    if (Object.keys(newError).length > 0) {
      setErrors(newError);
    } else {
      dispatch(signUpUser({ email, password, firstName, lastName }));
      setErrors({});
      navigate("/");
    }
  };

  return (
    <>
      <div className="lg:w-1/3 w-full lg:py-12 p-5 mx-auto">
        <h1 className="font-bold text-center">Rabta</h1>
        {/* Sign up  */}
        <div className="border border-gray-100 bg-white shadow-2xl lg:p-18 p-8 flex flex-col gap-3.5">
          <form
            onSubmit={SubmitHandler}
            action=""
            className="flex flex-col gap-2"
          >
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 w-1/2">
                <label htmlFor="" className="text-sm">
                  First Name
                </label>
                <input
                  className={` lg:p-2 p-1 border outline-0 ${errors.firstName ? "border-error" : "border-gray-200"}  rounded-lg `}
                  type="text"
                  value={firstName}
                  placeholder=""
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <p className="text-sm text-red-600">{errors.firstName}</p>
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <label htmlFor="" className="text-sm">
                  Last Name
                </label>
                <input
                  className={`lg:p-2 p-1 border outline-0 ${errors?.lastName ? "border-error" : "border-gray-200"}  rounded-lg `}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <p className="text-sm text-red-600">{errors.lastName}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Date of birth
              </label>
              <div className="flex gap-3">
                <div className="w-1/3">
                  <select
                    className={`w-full lg:text-[16px] text-sm lg:p-2 p-1 border outline-0 ${errors.day ? "border-error" : "border-gray-200"} rounded-lg `}
                    name=""
                    id=""
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                  >
                    <option value="">Day</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">4</option>
                  </select>
                  <p className="text-sm text-red-600">{errors.day}</p>
                </div>
                <div className="w-1/3">
                  <select
                    className={`w-full lg:text-[16px] text-sm lg:p-2 p-1 border outline-0 ${errors.month ? "border-error" : "border-gray-200"}  rounded-lg `}
                    name=""
                    id=""
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option hidden value="">
                      Month
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                  <p className="text-sm text-red-600">{errors.month}</p>
                </div>
                <div className="w-1/3">
                  <select
                    className={`w-full lg:text-[16px] text-sm lg:p-2 p-1 border outline-0 ${errors.year ? "border-error" : "border-gray-200"}  rounded-lg `}
                    name=""
                    id=""
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option hidden value="">
                      Year
                    </option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                  </select>
                  <p className="text-sm text-red-600">{errors.year}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Gender
              </label>
              <select
                className={`lg:p-2 lg:text-[16px] text-sm p-1 border outline-0 ${errors.gender ? "border-error" : "border-gray-200"}  rounded-lg `}
                name=""
                id=""
                onChange={(e) => setGender(e.target.value)}
              >
                <option hidden value="Male">
                  Gender
                </option>
                <option value="Female">Male</option>
                <option value="Female">Female</option>
                <option value="custom">Cusotm</option>
              </select>
              <p className="text-sm text-red-600">{errors.gender}</p>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Email
              </label>
              <input
                className={`lg:p-2 p-1 border outline-0 ${errors.email ? "border-error" : "border-gray-200"}  rounded-lg `}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-sm text-red-600">{errors.email}</p>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Mobile number
              </label>
              <input
                className={`lg:p-2 p-1 border outline-0 ${errors.phone ? "border-error" : "border-gray-200"} rounded-lg `}
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-sm text-red-600">{errors.phone}</p>
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col gap-1 w-1/2">
                <label htmlFor="" className="text-sm">
                  Password
                </label>
                <input
                  className={`lg:p-2 p-1 border outline-0 ${errors.password ? "border-error" : "border-gray-200"}  rounded-lg `}
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-sm text-red-600">{errors.password}</p>
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <label htmlFor="" className="text-sm">
                  Confirm Password
                </label>
                <input
                  className={`lg:p-2 p-1 border outline-0 ${errors.confirmPassword ? "border-error" : "border-gray-200"}  rounded-lg `}
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              </div>
            </div>
            <p className="text-sm text-red-600">{errors.passwordNotMatch}</p>
            <div className="flex flex-col gap-1">
              <input
                className="bg-[#3B82F6] text-white uppercase cursor-pointer lg:p-2 p-1 border outline-0 border-gray-200 rounded-lg "
                type="submit"
              />
            </div>
          </form>
          <div className="flex flex-col gap-1 ">
            <button
              onClick={() => setIsLogin(true)}
              className="cursor-pointer lg:p-2 p-1 border outline-0 border-gray-200 rounded-lg"
            >
              I already have an account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignUp;
