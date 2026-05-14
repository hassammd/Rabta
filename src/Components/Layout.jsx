import { Outlet, useNavigate } from "react-router";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../Firebase";
import { FaUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers } from "../Redux/allUsersSlice";

const Layout = () => {
  const userList = useSelector((state) => state.allUsers.allUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Search Logic
  const userFilter = userList.filter((items) => {
    if (!items.firstName) return false;
    const fullName = `${items.firstName} ${items.lastName}`.toLowerCase();
    const searchLower = searchTerm.trim().toLowerCase();
    return fullName.includes(searchLower);
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "!=", user.uid));
        const docSnap = await getDocs(q);
        const userSnapList = docSnap.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        dispatch(setAllUsers(userSnapList));
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [dispatch]);

  return (
    <div className="max-w-[1300px] mx-auto bg-white">
      <div className="flex gap-0 flex-row min-h-screen">
        {/* --- LEFT SIDEBAR (Desktop: Fixed, Mobile: Bottom via Navbar component) --- */}
        <aside className="hidden md:block sticky top-0 h-screen py-5   md:w-fit lg:w-[275px]   border-gray-100">
          <Navbar />
        </aside>

        {/* --- MAIN CENTER COLUMN (Mobile: Full Width, Desktop: Middle) --- */}
        <main className="flex-1 border-r border-gray-100 overflow-y-auto no-scrollbar pb-20 md:pb-0">
          {/* Mobile-only Header (Optional: If not in Navbar) */}
          <div className="md:hidden sticky top-0 bg-white/80 backdrop-blur-md p-4 border-b border-gray-100 z-10">
            <h1 className="font-black text-2xl text-black">Rabta</h1>
          </div>

          <Outlet />

          {/* Mobile Bottom Navbar render hoga yahan (Component ke andar se) */}
          <div className="md:hidden">
            <Navbar />
          </div>
        </main>

        {/* --- RIGHT SIDEBAR (Hidden on Mobile and Tablets) --- */}
        <aside className="hidden xl:flex sticky top-0 h-screen flex-col gap-6 py-5 px-6 w-[350px]">
          {/* Search Bar */}
          <div className="relative">
            <label className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-full focus-within:bg-white focus-within:ring-1 focus-within:ring-black transition-all">
              <svg
                className="h-5 w-5 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent outline-none w-full text-sm"
                type="search"
                placeholder="Search Rabta"
              />
            </label>
          </div>

          {/* Suggested Users Card */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h2 className="font-black text-xl mb-4">Who to follow</h2>
            <div className="flex flex-col gap-4">
              {userFilter.slice(0, 5).map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center justify-between group"
                >
                  <div
                    onClick={() => navigate(`/profile/${user.uid}`)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.firstName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full">
                          <FaUser className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold text-sm hover:underline">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        @{user.userName}
                      </span>
                    </div>
                  </div>
                  <button className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-800 transition-all">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Layout;
