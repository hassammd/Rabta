import { useState } from "react";
import { useDispatch } from "react-redux";
import { signUpUser } from "../Redux/SignUpSlice";
import { last } from "firebase/firestore/pipelines";
import { useNavigate } from "react-router";
import logo from "../assets/Rabta-logo.png";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

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
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SubmitHandler = async (e) => {
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
      try {
        setErrors({});
        await dispatch(
          signUpUser({ email, password, firstName, lastName }),
        ).unwrap();
        navigate("/");
      } catch (err) {
        setErrors({ email: err });
      }
    }
  };

  return (
    <>
      <div className="px-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-9 lg:flex-row items-center justify-center w-full xl:w-[70%] lg:py-12 p-5 mx-auto">
        {/* left side */}
        <div className="flex items-center justify-center lg:w-[30%]  md:w-1/3 ">
          <img className="lg:w-[50%] w-[100px]" src={logo} alt="" />
        </div>
        {/* right side */}
        {/* Sign up  */}
        <div className="lg:w-[60%] xl:w-1/2 md:w-[70%] w-full lg:p-18  flex flex-col gap-3.5">
          <form
            onSubmit={SubmitHandler}
            action=""
            className="w-full flex flex-col gap-2"
          >
            <div className="flex  gap-3">
              <div className="flex flex-col gap-1 w-[48%] ">
                <label htmlFor="" className="text-sm">
                  First Name
                </label>
                <input
                  className={`   py-2 px-4 text-sm border outline-0 ${errors.firstName ? "border-error" : "border-gray-200"}   rounded-full `}
                  type="text"
                  value={firstName}
                  placeholder=""
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <p className="text-[11px] text-red-600">{errors.firstName}</p>
              </div>
              <div className="flex flex-col gap-1 w-[48%] ">
                <label htmlFor="" className="text-sm">
                  Last Name
                </label>
                <input
                  className={`  py-2 px-4 text-sm border outline-0 ${errors?.lastName ? "border-error" : "border-gray-200"}   rounded-full `}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <p className="text-[11px] text-red-600">{errors.lastName}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-sm">
                Date of birth
              </label>
              <div className="flex gap-3">
                <div className="w-1/3 relative">
                  <select
                    className={` appearance-none w-full lg:text-[16px] text-sm   py-2 px-4   border outline-0 ${errors.day ? "border-error" : "border-gray-200"}  rounded-full `}
                    name=""
                    id=""
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                  >
                    <option hidden value="">
                      Day
                    </option>
                    {[...Array(31)].map((items, index) => (
                      <option value={index + 1}>{index + 1}</option>
                    ))}
                  </select>
                  <MdOutlineKeyboardArrowDown className="pointer-events-none absolute top-3 right-3" />
                  <p className="text-[11px] text-red-600">{errors.day}</p>
                </div>
                <div className=" w-1/3 relative">
                  <select
                    className={` appearance-none w-full lg:text-[16px] text-sm   py-2 px-3 text border rounded-full outline-0 ${errors.month ? "border-error" : "border-gray-200"}   rounded-full `}
                    name=""
                    id=""
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option hidden value="">
                      Month
                    </option>
                    {months.map((items) => (
                      <option value={items}>{items}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-red-600">{errors.month}</p>
                  <MdOutlineKeyboardArrowDown className="pointer-events-none absolute top-3 right-3" />
                </div>
                <div className="w-1/3 relative">
                  <select
                    className={`appearance-none w-full lg:text-[16px]   py-2 px-3 text-sm border outline-0 ${errors.year ? "border-error" : "border-gray-200"}   rounded-full `}
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
                  <p className="text-[11px] text-red-600">{errors.year}</p>
                  <MdOutlineKeyboardArrowDown className="pointer-events-none absolute top-3 right-3" />
                </div>
              </div>
            </div>
            <div className="relative flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Gender
              </label>

              <select
                className={`appearance-none   lg:text-[16px] text-sm py-2 px-4 text-sm border outline-0 ${errors.gender ? "border-error" : "border-gray-200"}   rounded-full `}
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
              <p className="text-[11px] text-red-600">{errors.gender}</p>
              <MdOutlineKeyboardArrowDown className="pointer-events-none absolute top-9 right-3" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Email
              </label>
              <input
                className={`  py-2 px-4 text-sm border outline-0 ${errors.email ? "border-error" : "border-gray-200"}   rounded-full `}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-[11px] text-red-600">{errors.email}</p>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Mobile number
              </label>
              <input
                className={`  py-2 px-4 text-sm border outline-0 ${errors.phone ? "border-error" : "border-gray-200"}  rounded-full `}
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-[11px] text-red-600">{errors.phone}</p>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 w-[48%]">
                <label htmlFor="" className="text-sm">
                  Password
                </label>
                <input
                  className={`  py-2 px-4 text-sm border outline-0 ${errors.password ? "border-error" : "border-gray-200"}   rounded-full `}
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-[11px] text-red-600">{errors.password}</p>
              </div>
              <div className="flex flex-col gap-1 w-[48%]">
                <label htmlFor="" className="text-sm">
                  Confirm Password
                </label>
                <input
                  className={`  py-2 px-4 text-sm border outline-0 ${errors.confirmPassword ? "border-error" : "border-gray-200"}   rounded-full `}
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <p className="text-[11px] text-red-600">
                  {errors.confirmPassword}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-red-600">
              {errors.passwordNotMatch}
            </p>
            <div className="flex flex-col gap-1">
              <input
                className="bg-[#3B82F6] text-white uppercase cursor-pointer   py-2 px-4 border outline-0 border-gray-200  rounded-full "
                type="submit"
              />
            </div>
          </form>
          Already have an account?
          <div className="flex flex-col gap-1 ">
            <button
              onClick={() => setIsLogin(true)}
              className="cursor-pointer    py-2 px-4  border outline-0 border-gray-200 rounded-full"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignUp;
