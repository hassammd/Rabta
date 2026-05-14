import { signOut } from "firebase/auth";
import { auth, db } from "../../Firebase";
import { Link, NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../Redux/SignInSlice";
import { setUser } from "../Redux/userSlice";
import { IoHomeOutline, IoHome } from "react-icons/io5";
import { FiUserPlus } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import { FaUser, FaPlusSquare } from "react-icons/fa";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
import logo from "../assets/Rabta-logo.png";
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            dispatch(setUser(docSnap.data()));
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [dispatch]);

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
      activeIcon: <IoHome />,
      url: "/",
    },
    {
      name: "Follow",
      icons: <FiUserPlus />,
      activeIcon: <FiUserPlus />,
      url: "/follow",
    },
    {
      name: "Profile",
      icons: <LuUser />,
      activeIcon: <FaUser />,
      url: "/profile",
    },
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Visible on md and up) --- */}
      <div className="hidden md:flex flex-col justify-between h-screen sticky top-0 p-5 border-r border-gray-100  min-w-[250px] md:min-w-[100px] ">
        <div className="flex flex-col gap-10">
          <div>
            <Link to="/" className=" font-black text-black">
              <img src={logo} alt="" className="w-[100px]" />
            </Link>
          </div>
          <nav>
            <ul className="flex flex-col gap-4">
              {nav.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3 rounded-full text-xl transition-all ${
                        isActive ? "font-bold bg-gray-100" : "hover:bg-gray-50"
                      }`
                    }
                  >
                    <span className="text-2xl">{item.icons}</span>
                    <span className="hidden lg:block">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* User Profile Section (Desktop) */}
        <div className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-full transition-all cursor-pointer border border-transparent hover:border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
              {currentUser?.profilePic ? (
                <img
                  src={currentUser.profilePic}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUser className="text-gray-400 m-auto mt-2" />
              )}
            </div>
            <div className="hidden lg:flex flex-col leading-tight">
              <h3 className="font-bold text-sm truncate max-w-[120px]">
                {currentUser?.firstName || "User"}
              </h3>
              <span className="text-xs text-gray-500">
                @{currentUser?.userName || "username"}
              </span>
            </div>
          </div>
          <div className="dropdown dropdown-top lg:dropdown-end md:dropdown-start ">
            <div
              tabIndex={0}
              role="button"
              className="p-2 hover:bg-gray-200 rounded-full"
            >
              <HiDotsHorizontal />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-xl border-gray-200 mb-2"
            >
              <li onClick={logoutUser} className="text-error font-semibold">
                <a>
                  <MdLogout /> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- MOBILE TOP NAVBAR (Visible on mobile only) --- */}
      {/* <div className="md:hidden flex items-center justify-between px-5 py-3 sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="h-8 w-8 rounded-full overflow-hidden">
          <img
            src={currentUser?.profilePic}
            className="h-full w-full object-cover"
            alt="me"
          />
        </div>
        <Link to="/" className="text-xl font-bold italic">
          Rabta
        </Link>
        <button onClick={logoutUser} className="text-gray-600 text-xl">
          <MdLogout />
        </button>
      </div> */}

      {/* --- MOBILE BOTTOM TAB BAR (Visible on mobile only) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
        {nav.map((item) => (
          <NavLink
            key={item.name}
            to={item.url}
            className={({ isActive }) =>
              `text-2xl transition-all ${isActive ? "text-black scale-110" : "text-gray-400"}`
            }
          >
            {item.icons}
          </NavLink>
        ))}
        {/* Extra Action Button for Mobile (Optional) */}
        <button className="bg-black text-white p-3 rounded-full shadow-lg -mt-10 border-4 border-white">
          <FaPlusSquare />
        </button>
      </div>
    </>
  );
};

export default Navbar;
