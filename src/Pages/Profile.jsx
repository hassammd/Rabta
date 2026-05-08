import { useEffect, useState } from "react";
import { FaCamera, FaUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../Firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { LuCalendarDays } from "react-icons/lu";
import PopUpBox from "../Components/PopUpBox";
import CreatePost from "../Components/CreatePost";
import { IoCameraOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import button from "daisyui/components/button";
import { setUser } from "../Redux/userSlice";
const Profile = () => {
  // const [currentUser, setcurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isBoxActive, setIsBoxActive] = useState(false);
  const [profielImageUrl, setProfileImageUrl] = useState(null);
  const [editProfileImageBox, setEditProfileImageBox] = useState(false);
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  console.log("this is useSelector", currentUser);

  //image upload on Cloudinary
  const prfileImageUpload = async () => {
    if (!profielImageUrl) {
      return alert("select image file");
    }
    setProfileImageLoading(true);
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
          profilePic: finalUrl, //link save in database
        });

        // All old posts profile image update

        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("uid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        console.log("this is Query Snap.....", querySnapshot);
        //batch start to update all posts at once
        const batch = writeBatch(db);
        querySnapshot.forEach((postDoc) => {
          const postDocRef = doc(db, "posts", postDoc.id);
          batch.update(postDocRef, { profilePic: finalUrl });
        });
        await batch.commit();
        dispatch(setUser({ ...currentUser, profilePic: finalUrl }));
        // setcurrentUser();
        setProfileImageUrl(null);
        setProfileImageLoading(false);
        setTimeout(() => {
          document.getElementById("my_modal_2").close();
        }, 2000);
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
          dispatch(setUser(docSnap.data()));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchcurrentUser();
  }, [dispatch]);
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
              <label className=" cursor-pointer flex items-end  gap-4 absolute -bottom-9 left-9">
                <div
                  onClick={() =>
                    document.getElementById("my_modal_2").showModal()
                  }
                  className="overflow-hidden border border-gray-300  h-30 w-30 bg-gray-100 flex items-center justify-center rounded-full"
                >
                  {currentUser.profilePic ? (
                    <img
                      className="h-full w-full object-cover"
                      src={currentUser.profilePic}
                      alt="Profile"
                    />
                  ) : (
                    <FaUser className="text-gray-300 text-5xl" />
                  )}
                </div>
              </label>
              {/* <label
                htmlFor="profile_image"
                className=" cursor-pointer flex items-end  gap-4 absolute -bottom-9 left-9"
              >
                <div
                  onClick={() => setEditProfileImageBox(true)}
                  className="overflow-hidden border border-gray-300  h-30 w-30 bg-gray-100 flex items-center justify-center rounded-full"
                >
                  {currentUser.profilePic ? (
                    <img
                      className="h-full w-full object-cover"
                      src={currentUser.profilePic}
                      alt="Profile"
                    />
                  ) : (
                    <FaUser className="text-gray-300 text-5xl" />
                  )}
                </div>
              </label> */}
            </div>
          </div>

          {editProfileImageBox ? (
            ""
          ) : (
            <>
              {/* Open the modal using document.getElementById('ID').showModal() method */}

              <dialog id="my_modal_2" className="modal">
                <div className="flex flex-col gap-14 items-center justify-center modal-box h-[400px]">
                  <div>
                    <label
                      htmlFor="profile_image"
                      className=" cursor-pointer flex items-end  gap-4 "
                    >
                      <div
                        onClick={() =>
                          document.getElementById("my_modal_2").showModal()
                        }
                        className="overflow-hidden border border-gray-300  h-30 w-30 bg-gray-100 flex items-center justify-center rounded-full"
                      >
                        {!profileImageLoading ? (
                          <img
                            className="h-full w-full object-cover"
                            src={currentUser.profilePic}
                            alt="Profile"
                          />
                        ) : (
                          <span className="loading loading-bars loading-xs"></span>
                        )}
                      </div>
                    </label>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      {profielImageUrl ? (
                        <button
                          onClick={prfileImageUpload}
                          className="btn bg-gray-100 rounded-full px-4"
                        >
                          Save Changes
                        </button>
                      ) : (
                        <label
                          htmlFor="profile_image"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <IoCameraOutline className="text-2xl text-gray-500" />
                          <h1>Update</h1>
                        </label>
                      )}
                    </div>
                    <div className="flex flex-col items-center"></div>
                    <div className="flex flex-col items-center">
                      <RiDeleteBinLine className="cursor-pointer text-2xl text-gray-500" />
                      <h1>Delete</h1>
                    </div>
                  </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </>
          )}
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
