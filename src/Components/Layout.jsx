import { Outlet, useNavigate } from "react-router";
import Navbar from "./Navbar";
import Profile from "../Pages/Profile";
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

  const userFilter = userList.filter((items) => {
    if (!items.firstName) return false;
    const firstName = items.firstName.toLowerCase();
    const lastName = items.lastName.toLowerCase();
    const searchLower = searchTerm.trim().toLowerCase();
    return firstName.includes(searchLower) || lastName.includes(searchLower);
  });

  console.log("this is search filter", userFilter);
  useEffect(() => {
    const fetchUsers = async () => {
      const user = auth.currentUser;
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "!=", user.uid));

        const docSnap = await getDocs(q);
        const userSnapList = docSnap.docs.map((item) => {
          return {
            id: item.id,
            ...item.data(),
          };
        });
        // setUserList(userSnapList);
        dispatch(setAllUsers(userSnapList));
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [dispatch]);
  return (
    <>
      <div className="container">
        <div className="flex flex-row h-screen">
          {/* left side */}
          <div className="sticky top-0 overflow-y-auto py-10 px-4 w-[275px]">
            <Navbar />
          </div>

          {/* center col */}
          <div className="border border-gray-200 overflow-y-auto h-screen w-[60%] no-scrollbar">
            <Outlet />
          </div>

          {/* right side */}
          <div className="h-screen sticky top-0 flex flex-col gap-10 py-10 px-4 w-[350px]">
            {/* search */}
            <div>
              <label className="input">
                <svg
                  className=" h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=""
                  type="search"
                  required
                  placeholder="Search"
                />
              </label>
            </div>
            {/* user list   */}

            <div className="flex flex-col gap-4">
              {!userFilter
                ? userList
                : userFilter.map((users) => {
                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <div
                            onClick={() => navigate(`/profile/${users.uid}`)}
                            class="flex items-center justify-between w-full p-2  rounded-full transition-all cursor-pointer"
                          >
                            <div class="flex items-center gap-3">
                              <div class="h-12 w-12 bg-gray-200 border border-gray-300 flex items-center justify-center rounded-full overflow-hidden flex-shrink-0">
                                {users.profilePic ? (
                                  <img src={users.profilePic} alt="" />
                                ) : (
                                  <FaUser />
                                )}
                              </div>
                              <div class="flex flex-col leading-tight">
                                <h3 class="font-bold text-sm lg:text-base truncate max-w-[100px] lg:max-w-[150px]">
                                  {`${users.firstName} ${users.lastName}`}
                                </h3>
                                <span class="text-xs text-gray-500 truncate">
                                  {users.userName}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="btn rounded-full">Follow</button>
                        </div>
                      </>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Layout;
