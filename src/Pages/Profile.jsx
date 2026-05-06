import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { auth, db } from "../../Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { LuCalendarDays } from "react-icons/lu";
import PopUpBox from "../Components/PopUpBox";
import CreatePost from "../Components/CreatePost";
const Profile = () => {
  const [currentUser, setcurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isBoxActive, setIsBoxActive] = useState(false);
  const [profielImageUrl, setProfileImageUrl] = useState(null);

  //image upload
  const prfileImageUpload = async () => {
    if (!profielImageUrl) {
      return alert("select image file");
    }
    try {
      // Cloudinary Upload
      const formData = new FormData();
      formData.append("file", profielImageUrl);
      formData.append("upload_preset", "Rabta-profile-image-preset");
      formData.append("cloud_name", "dnraccvup");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dnraccvup/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      const finalUrl = data.secure_url;
      //firestore update

      if (currentUser?.uid) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          profilePic: finalUrl, //linke save in database
        });
        //local state update
      }
    } catch (err) {
      console.log(err);
    }
  };

  //add user profile image url in firestore data

  useEffect(() => {
    const fetchcurrentUser = async () => {
      try {
        //current user
        const User = auth.currentUser;

        const docRef = doc(db, "users", User.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setcurrentUser(docSnap.data());
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchcurrentUser();
  }, [currentUser]);
  return (
    <>
      {!loading ? (
        <div className="flex flex-col h-screen rounded-sm">
          {/* banner */}
          <div>
            <div className="relative flex items-center justify-center bg-gray-300 h-[250px]">
              <h1 className="text-9xl font-bold uppercase text-gray-100">
                Banner
              </h1>
              <input
                onChange={(e) => {
                  setProfileImageUrl(e.target.files[0]);
                }}
                hidden
                id="profile_image"
                type="file"
              />
              <label
                htmlFor="profile_image"
                className=" cursor-pointer flex items-end  gap-4 absolute -bottom-9 left-9"
              >
                <div className="overflow-hidden border border-gray-300  h-30 w-30 bg-gray-100 flex items-center justify-center rounded-full">
                  <img className="" src={currentUser.profilePic} alt="" />
                  <FaUser className="text-gray-300 text-5xl" />
                </div>
              </label>
            </div>
          </div>
          <button
            onClick={prfileImageUpload}
            className="bg-red-600 cursor-pointer"
          >
            Upload Image
          </button>
          {/* banner end */}

          <div className=" flex flex-col gap-4 px-4 mt-15">
            <div className="flex justify-between">
              <div>
                <div>
                  <h3 className="font-bold">
                    {`${currentUser?.firstName} ${currentUser?.lastName}`}
                  </h3>
                </div>
                <span className="text-sm">
                  {currentUser.userName?.toLowerCase()}
                </span>
              </div>
              <button
                onClick={() => setIsBoxActive(!isBoxActive)}
                className="btn rounded-full"
              >
                Set up profile
              </button>
              {isBoxActive ? (
                <PopUpBox
                  currentUser={currentUser}
                  setIsBoxActive={setIsBoxActive}
                />
              ) : null}
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <LuCalendarDays /> <span>Joined</span>
                  <span className="text-sm">{currentUser.createAt}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span>0 Following</span>
                <span>0 Followers</span>
              </div>
            </div>
          </div>
          <CreatePost currentUser={currentUser} />
        </div>
      ) : (
        <span class="$$loading $$loading-spinner text-info"></span>
      )}
    </>
  );
};

export default Profile;
