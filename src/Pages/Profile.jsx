import { useEffect, useId, useState } from "react";
import { FaCamera, FaUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../Firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { LuCalendarDays, LuHardDriveUpload } from "react-icons/lu";
import PopUpBox from "../Components/PopUpBox";
import CreatePost from "../Components/CreatePost";
import { IoCameraOutline } from "react-icons/io5";
import {
  MdEdit,
  MdOutlineDeleteOutline,
  MdOutlineFileUpload,
} from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import button from "daisyui/components/button";
import { setUser, updateBannerImage } from "../Redux/userSlice";
import { RxCross2 } from "react-icons/rx";
import { useParams } from "react-router";
import PostCard from "../Components/PostCard";

const Profile = () => {
  // const [currentUser, setcurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isBoxActive, setIsBoxActive] = useState(false);
  const [profielImageUrl, setProfileImageUrl] = useState(null);
  const [editProfileImageBox, setEditProfileImageBox] = useState(false);
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const [bannerImageLoading, setBannerImageLoading] = useState(false);
  const [previewLink, setPreviewLink] = useState("");
  const [profileImagePreviewLink, setProfileImagePreviewLink] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [currentUserPosts, setCurrentUserPosts] = useState([]);

  console.log("this is profile image link::::", profileImagePreviewLink);

  const alluserPostID = useSelector(
    (state) => state.allUsers.allUsersPostisIds,
  );
  const param = useParams();

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  //upload banner image on Cloudinary
  const bannerImageUpload = async () => {
    if (!bannerImageUrl) {
      return alert("Select image for Your Banner");
    }
    setBannerImageLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", bannerImageUrl);
      formData.append("upload_preset", "Rabta-user-banner-image");
      formData.append("cloud_name", "dnraccvup");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dnraccvup/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      const bannerUrl = data.secure_url;

      //now updating firestore
      if (currentUser.uid) {
        const userRef = doc(db, "users", currentUser.uid);
        const bannerImage = await updateDoc(userRef, {
          bannerPic: bannerUrl,
        });
        dispatch(setUser({ ...currentUser, bannerPic: bannerUrl }));
        setBannerImageLoading(false);
        setTimeout(() => {
          document.getElementById("banner-model").close();
          setPreviewLink("");
        }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //upload profile image on Cloudinary
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

        //batch start to update all posts at once
        const batch = writeBatch(db);
        querySnapshot.forEach((postDoc) => {
          const postDocRef = doc(db, "posts", postDoc.id);
          batch.update(postDocRef, { profilePic: finalUrl });
        });
        await batch.commit();
        dispatch(setUser({ ...currentUser, profilePic: finalUrl }));

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
      setLoading(true);
      try {
        // user
        const UserId = param.uid || auth.currentUser?.uid;

        if (!UserId) return;
        const docRef = doc(db, "users", UserId);
        // const docSnap = await getDoc(docRef);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            dispatch(setUser(snapshot.data()));
          }
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchcurrentUser();
    () => {
      if (unsubscribe) unsubscribe();
    };
  }, [param.uid]);

  //current user's Posts

  useEffect(() => {
    const CurrentUsersPostHandler = async () => {
      if (!currentUser) return;
      setLoading(true);
      const userId = auth.currentUser.uid;
      const targetId = param?.uid || currentUser?.uid;
      try {
        const postsRef = collection(db, "posts");
        console.log("thisis adsfasdfdasdf", postsRef);
        const q = query(postsRef, where("uid", "==", targetId));
        const unsubscribe = await onSnapshot(q, (querySnapShot) => {
          const userPosts = querySnapShot.docs.map((doc) => ({
            postId: doc.id,
            ...doc.data(),
          }));
          setCurrentUserPosts(userPosts);
          setLoading(false);
        });
      } catch (err) {
        console.log(err);
      }
    };
    CurrentUsersPostHandler();
  }, [param?.uid, currentUser?.uid]);

  return (
    <>
      <editPostBox />
      {!loading ? (
        <div className="flex flex-col h-screen rounded-sm">
          {/* banner */}
          <div className=" relative flex items-center justify-center bg-gray-300 lg:h-[250px] h-[140px]">
            {/* banner image */}
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setBannerImageUrl(file);
                  setPreviewLink(URL.createObjectURL(file));
                }
              }}
              hidden
              type="file"
              id="banner_image"
            />

            {/* banner edit button */}
            {!param.uid && (
              <span
                onClick={() =>
                  document.getElementById("banner-model").showModal()
                }
                className="absolute top-4 right-4 p-2 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-200 transition-all duration-300"
              >
                <MdEdit className="text-xl " />
              </span>
            )}

            {/* Open modal for banner image */}

            <dialog id="banner-model" className="modal">
              <div className="modal-box">
                {!previewLink ? (
                  <label htmlFor="banner_image">
                    <div className="cursor-pointer mx-auto rounded-sm w-[100px] h-[50px] border border-gray-300   flex items-center justify-center">
                      <LuHardDriveUpload className="text-2xl text-gray-500" />
                    </div>
                  </label>
                ) : (
                  <div className="flex flex-col items-center gap-5">
                    <img src={previewLink} alt="" />
                    <button
                      className="bg-blue-400 rounded-2xl px-2 text-sm text-white cursor-pointer"
                      onClick={bannerImageUpload}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
            {!bannerImageLoading ? (
              <img
                className="w-full h-full object-cover"
                src={currentUser.bannerPic}
                alt=""
              />
            ) : (
              <span className="loading loading-bars loading-xs"></span>
            )}
            {/* profile image */}
            <input
              onChange={(e) => {
                const profileImage = e.target.files[0];
                if (profileImage) {
                  setProfileImageUrl(profileImage);
                  setProfileImagePreviewLink(URL.createObjectURL(profileImage));
                }
              }}
              hidden
              id="profile_image"
              type="file"
            />

            <label className=" cursor-pointer flex items-end  gap-4 absolute lg:-bottom-9 lg:left-9 left-3 -bottom-8">
              <div
                onClick={() =>
                  document.getElementById("my_modal_2").showModal()
                }
                className="overflow-hidden border border-gray-300  lg:h-30 lg:w-30 h-20 w-20 bg-gray-100 flex items-center justify-center rounded-full"
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
          </div>
          {editProfileImageBox ? (
            ""
          ) : (
            <>
              {/* Open modal for profile image */}
              {!param.uid && (
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
                          className="overflow-hidden border border-gray-300  lg:h-30 lg:w-30 h-20 w-20 bg-gray-100 flex items-center justify-center rounded-full"
                        >
                          {!profileImageLoading ? (
                            <>
                              <img
                                className="h-full w-full object-cover"
                                src={
                                  profileImagePreviewLink
                                    ? profileImagePreviewLink
                                    : currentUser.profilePic
                                }
                                alt="Profile"
                              />
                            </>
                          ) : (
                            <span className="loading loading-bars loading-xs"></span>
                          )}
                        </div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center w-full">
                      <div>
                        {profielImageUrl ? (
                          <>
                            <div
                              className="flex items-center justify-center flex-col cursor-pointer "
                              onClick={prfileImageUpload}
                            >
                              <span className="text-2xl text-gray-500">
                                <IoCameraOutline className="text-2xl text-gray-500" />
                              </span>
                              <h1>Update</h1>
                            </div>
                          </>
                        ) : (
                          <label
                            htmlFor="profile_image"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            {/* <IoCameraOutline className="text-2xl text-gray-500" /> */}
                            <MdOutlineFileUpload className="text-2xl text-gray-500" />
                            <h1>Upload</h1>
                          </label>
                        )}
                      </div>
                      <div className="flex flex-col items-center"></div>
                      <div
                        onClick={() => {
                          setProfileImageUrl("");
                          setProfileImagePreviewLink("");
                        }}
                        className="flex flex-col items-center"
                      >
                        <RiDeleteBinLine className="cursor-pointer text-2xl text-gray-500" />
                        <h1>Delete</h1>
                      </div>
                    </div>
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                  </form>
                </dialog>
              )}
            </>
          )}
          {/* banner end */}
          {/* profile iamge section */}
          <div className=" flex flex-col gap-4 px-4 pb-8 rounded-b-3xl rounded-t-0 pt-15 bg-white">
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
              {!param.uid && (
                <button
                  onClick={() => setIsBoxActive(!isBoxActive)}
                  className="btn rounded-full text-sm"
                >
                  Set up profile
                </button>
              )}

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
                  <LuCalendarDays /> <span className="text-sm">Joined</span>
                  <span className="text-sm">
                    {/* Optional Chaining aur Null check  */}
                    {currentUser?.createAt
                      ? new Date(currentUser.createAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "Recently"}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <div>
                  <span className="font-semibold text-sm">
                    {!currentUser.following
                      ? "0"
                      : currentUser.following.length}
                  </span>
                  <span className="text-sm"> Following</span>
                </div>
                <div>
                  <span className="font-semibold text-sm">
                    {!currentUser.followers
                      ? "0"
                      : currentUser.followers.length}
                  </span>
                  <span className="text-sm"> followers</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <CreatePost currentUser={currentUser} />
          </div>
          <div className="flex flex-col gap-7 mt-10">
            {currentUserPosts?.map((post) => {
              return <PostCard param={param} currentUserPostsData={post} />;
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-screen rounded-sm animate-pulse">
          {/* Banner Skeleton */}
          <div className="relative bg-gray-200 h-[250px] w-full">
            {/* Profile Image Skeleton */}
            <div className="absolute -bottom-9 left-9">
              <div className="h-32 w-32 bg-gray-300 rounded-full border-4 border-white"></div>
            </div>
          </div>

          {/* Profile Info Skeleton */}
          <div className="flex flex-col gap-4 px-4 mt-16">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                {/* Name */}
                <div className="h-6 w-48 bg-gray-300 rounded-md"></div>
                {/* Username */}
                <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
              </div>
              {/* Button */}
              {/* <div className="h-10 w-32 bg-gray-300 rounded-full"></div> */}
            </div>

            {/* Bio/Stats Skeleton */}
            <div className="flex flex-col gap-4 mt-2">
              {/* Joined Date */}
              <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
              {/* Followers/Following */}
              <div className="flex gap-3">
                <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          </div>

          {/* Feed Skeleton (Create Post area) */}
          <div className="px-4 mt-10">
            <div className="h-24 w-full bg-gray-100 rounded-xl border border-gray-200"></div>
          </div>
          <div className="px-4 mt-10">
            <div className="h-15 w-full bg-gray-100 rounded-xl border border-gray-200"></div>
          </div>
          <div className="px-4 mt-10">
            <div className="h-15 w-full bg-gray-100 rounded-xl border border-gray-200"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
