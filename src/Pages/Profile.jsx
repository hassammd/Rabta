import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { auth, db } from "../../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { LuCalendarDays } from "react-icons/lu";
import PopUpBox from "../Components/PopUpBox";
const Profile = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isBoxActive, setIsBoxActive] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        //current user
        const currentUser = auth.currentUser;

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userData]);
  return (
    <>
      <div className="flex flex-col border border-gray-200  h-screen rounded-sm">
        {/* banner */}
        <div>
          <div className="relative flex items-center justify-center bg-gray-300 h-[250px]">
            <h1 className="   text-9xl font-bold uppercase text-gray-100">
              Banner
            </h1>
            <div className="flex items-end  gap-4 absolute -bottom-9 left-9">
              <div className=" border border-gray-300  h-30 w-30 bg-gray-100 flex items-center justify-center rounded-full">
                <FaUser className="text-gray-300 text-5xl" />
              </div>
            </div>
          </div>
        </div>
        {/* banner end */}
        <div className=" flex flex-col gap-4 px-4 mt-15">
          <div className="flex justify-between">
            <div>
              <div c>
                <h3 className="font-bold">
                  {`${userData.firstName} ${userData.lastName}`}
                </h3>
              </div>
              <span className="text-sm">
                {userData.userName?.toLowerCase()}
              </span>
            </div>
            <button
              onClick={() => setIsBoxActive(!isBoxActive)}
              className="btn rounded-full"
            >
              Set up profile
            </button>
            {isBoxActive ? (
              <PopUpBox userData={userData} setIsBoxActive={setIsBoxActive} />
            ) : null}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2">
                <LuCalendarDays /> <span>Joined</span>
                <span className="text-sm">{userData.createAt}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <span>0 Following</span>
              <span>0 Followers</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
