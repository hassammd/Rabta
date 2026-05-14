import { useEffect, useState } from "react";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../Firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Follow = () => {
  const userList = useSelector((state) => state.allUsers.allUsers);
  const curretnUser = useSelector((state) => state);
  console.log("this is current user", curretnUser.user.user);
  const [isFollowBtnActive, setIsFollowBtnActive] = useState(false);

  const navigate = useNavigate();

  const followHandler = async (targetUserId) => {
    const currentUserId = auth.currentUser?.uid;

    setIsFollowBtnActive(false);
    try {
      const userRef = doc(db, "users", currentUserId);
      await updateDoc(userRef, {
        following: arrayUnion(targetUserId),
      });

      const targetUserRef = doc(db, "users", targetUserId);
      await updateDoc(targetUserRef, {
        followers: arrayUnion(currentUserId),
      });
      //redux updated

      setIsFollowBtnActive(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="bg-gray-100  border-b-1 border-gray-300 px-3.5 py-4">
        <span className="text-black font-semibold text-sm">
          Suggested for you
        </span>
      </div>
      {userList?.map((users) => {
        return (
          <>
            <div className="  flex items-center lg:w-1/2">
              <div
                onClick={() => navigate(`/profile/${users.uid}`)}
                className="flex items-center justify-between w-full p-2  rounded-full transition-all cursor-pointer"
              >
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
              </div>
              <button
                onClick={() => followHandler(users.uid)}
                className={`btn rounded-full ${isFollowBtnActive ? "bg-black text-white" : ""} text-sm`}
              >
                Follow
              </button>
            </div>
          </>
        );
      })}
    </>
  );
};
export default Follow;
