import { signOut } from "firebase/auth";
import { auth, db } from "../../Firebase";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setLogout } from "../Redux/SignInSlice";
import { IoHomeOutline } from "react-icons/io5";
import { FiUserPlus } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import { FaUser } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState({});
  console.log("this is current user", currentUser);

  //fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentUser(docSnap.data());
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  const logoutUser = async () => {
    try {
      await signOut(auth);
      dispatch(setLogout());
      navigate("/auth");
    } catch (err) {
      console.log("Logout Error:", err.message);
    }
  };

  const nav = [
    {
      name: "Home",
      icons: <IoHomeOutline />,
      url: "/",
    },
    {
      name: "Follow",
      icons: <FiUserPlus />,
      url: "",
    },
    {
      name: "Profile",
      icons: <LuUser />,
      url: "/profile",
    },
  ];
  return (
    <>
      <div className="flex flex-col justify-between h-full gap-7">
        <div className="flex flex-col gap-20">
          <div>
            <Link className="text-3xl font-black">Rabta</Link>
          </div>
          <div>
            <ul className="flex flex-col items-start gap-5">
              {nav.map((items) => {
                return (
                  <li>
                    <Link
                      to={items.url}
                      className="flex items-center gap-5 text-xl"
                    >
                      <span>{items.icons}</span> {items.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-full transition-all cursor-pointer">
            {/* Left Side: Avatar and Info */}
            <div className="flex items-center gap-3">
              {/* Profile Image / Icon */}
              <div className="h-12 w-12 bg-gray-200 border border-gray-300 flex items-center justify-center rounded-full overflow-hidden flex-shrink-0">
                {currentUser?.profilePic ? (
                  <img
                    src={currentUser.profilePic}
                    alt="profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400 text-xl" />
                )}
              </div>

              {/* Name and Username */}
              <div className="flex flex-col leading-tight">
                <h3 className="font-bold text-sm lg:text-base truncate max-w-[100px] lg:max-w-[150px]">
                  {currentUser?.name || "User Name"}
                </h3>
                <span className="text-xs text-gray-500 truncate">
                  {currentUser?.userName || "username"}
                </span>
              </div>
            </div>

            {/* Right Side: Dropdown Menu */}
            <div className="dropdown dropdown-top dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <HiDotsHorizontal className="text-gray-600" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-xl border border-gray-100 mb-2"
              >
                <li onClick={logoutUser} className="text-error font-semibold">
                  <a className="flex items-center gap-3">
                    <MdLogout className="text-lg" />
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
