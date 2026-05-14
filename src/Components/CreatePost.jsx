import { useEffect, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { FaRegComment, FaRegHeart, FaRetweet, FaUser } from "react-icons/fa6";
import { FiImage } from "react-icons/fi";
import { MdOutlineGifBox, MdVerified } from "react-icons/md";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db, storage } from "../../Firebase";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoStatsChartOutline } from "react-icons/io5";
import { BsBookmark, BsUpload } from "react-icons/bs";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { RxCross2 } from "react-icons/rx";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

const CreatePost = ({ currentUser }) => {
  const [postText, setPostText] = useState("");
  const [currentUserPost, setCurrentUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [previewLink, setPreviewLink] = useState("");
  const [postLikes, setPostLikes] = useState(0);

  const param = useParams();

  //upload image file to cloudinary
  const uploadImage = async () => {
    try {
      if (!imageFile) {
        console.error("Select Your Image");
        return "";
      }
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "Rabta-preset");
      formData.append("cloud_name", "dnraccvup");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dnraccvup/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      const resJson = await res.json();

      return resJson.secure_url;
      // setImageUrl(resJson.secure_url);
    } catch (err) {
      console.log(err);
    }
  };

  //add post handler
  const handlePost = async (e) => {
    e.preventDefault();
    if (!currentUser.uid) return;
    if (!postText.trim() && !imageFile) return;
    setLoading(true);
    const finalImageUrl = await uploadImage();

    try {
      await addDoc(collection(db, "posts"), {
        text: postText,
        postImage: finalImageUrl,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        profilePic: currentUser.profilePic,
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
        like: [],
        comments: [],
      });

      setPostText("");
      setImageFile(null);
      setPreviewLink("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //get post handler

  useEffect(() => {
    const fetchCurrentUserPosts = async () => {
      if (!currentUser.uid) {
        console.log("User UID not available yet...");
        return;
      }
      try {
        const postsRef = collection(db, "posts");
        const q = query(
          postsRef,
          where("uid", "==", currentUser.uid),
          orderBy("createdAt", "desc"),
        );
        const postsSnapShot = await getDocs(q);

        //extract data
        const postsData = postsSnapShot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setCurrentUserPosts(postsData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCurrentUserPosts();
  }, [currentUser?.uid, currentUserPost]);

  return (
    <>
      {!param.uid && (
        <div className="">
          <form
            onSubmit={handlePost}
            className="p-4 flex flex-col border-b-1 border-t-1 mt-5 border-gray-300"
            action=""
          >
            <div className="flex">
              <div className=" ">
                <div className="h-12 w-12 bg-gray-200 border border-gray-300 flex items-center justify-center rounded-full overflow-hidden  ">
                  {currentUser.profilePic ? (
                    <img src={currentUser.profilePic} alt="" />
                  ) : (
                    <FaUser className="text-gray-400 text-xl" />
                  )}
                </div>
              </div>
              <div className="w-full">
                <textarea
                  onChange={(e) => setPostText(e.target.value)}
                  className="text-sm p-3 border-0 resize-none outline-0 border-gray-300 w-full"
                  rows="3"
                  name=""
                  id=""
                  value={postText}
                  placeholder=" What's happening?"
                ></textarea>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <input
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setPreviewLink(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                  id="post-image"
                  type="file"
                />
                <label
                  htmlFor="post-image"
                  className="cursor-pointer lg:text-3xl hover:bg-blue-100/50 hover:text-blue-500 rounded-full transition-all"
                >
                  <FiImage />
                </label>
              </div>
              <input
                className={`${postText || imageFile ? "bg-blue-500 text-white" : "bg-gray-200 disabled"} border cursor-pointer border-gray-100 rounded-4xl lg:px-5 lg:py-2 px-3.5 py-1.5 text-sm`}
                type="submit"
                value={"Post"}
              />
            </div>
            {/* image preview here */}
            {previewLink && (
              <div className="p-5 relative max-h-80 max-w-80 overflow-hidden">
                <img
                  className="w-full h-full object-cover rounded-xl border border-gray-200"
                  src={previewLink}
                  alt=""
                />
                <RxCross2
                  onClick={() => {
                    setPreviewLink("");
                    setImageFile(null);
                  }}
                  className="    text-white absolute top-10 right-10 cursor-pointer z-50"
                />
              </div>
            )}

            {loading ? "Posting..." : " "}
          </form>
        </div>
      )}

      {/* display posts */}
    </>
  );
};
export default CreatePost;
