import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Profile from "../Pages/Profile";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase";

const Layout = () => {
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const docSnap = await getDocs(usersRef);
        const userSnapList = docSnap.docs.map((item) => {
          return {
            id: item.id,
            ...item.data(),
          };
        });
        setUserList(userSnapList);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);
  return (
    <>
      <div className="container">
        <div className="flex flex-row">
          {/* left side */}
          <div className="py-10 px-4 w-[275px]">
            <Navbar />
          </div>

          {/* center col */}
          <div className="border border-gray-200 h-screen w-[60%]">
            <div>
              <Outlet />
            </div>
          </div>

          {/* right side */}
          <div className="flex flex-col gap-10 py-10 px-4 w-[350px]">
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
                  className=" "
                  type="search"
                  required
                  placeholder="Search"
                />
              </label>
            </div>
            {/* user list (static) */}

            <div className="flex flex-col gap-4">
              {userList.map((users) => {
                return (
                  <>
                    <div class="flex items-center justify-between w-full p-2  rounded-full transition-all cursor-pointer">
                      <div class="flex items-center gap-3">
                        <div class="h-12 w-12 bg-gray-200 border border-gray-300 flex items-center justify-center rounded-full overflow-hidden flex-shrink-0">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 448 512"
                            class="text-gray-400 text-xl"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"></path>
                          </svg>
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
