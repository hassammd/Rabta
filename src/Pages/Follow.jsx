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
                  <img src={users.profilePic} alt="" />
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
