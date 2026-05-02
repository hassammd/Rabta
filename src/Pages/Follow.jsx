import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase";

const Follow = () => {
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
      <h1>Suggested for you</h1>
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
    </>
  );
};
export default Follow;
