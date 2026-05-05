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

const CreatePost = ({ currentUser }) => {
  const [postText, setPostText] = useState("");
  const [currentUserPost, setCurrentUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  //handle image file
  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      console.log("file is selected", file);
    }
  };
  useEffect(() => {
    console.log(imageFile);
  }, [imageFile]);
  //add post handler
  const handlePost = async (e) => {
    e.preventDefault();
    if (!currentUser.uid) {
      console.log("User UID not available yet...");
      return;
    }
    setLoading(true);
    try {
      const imageUrl = "";
      //image file

      if (imageFile) {
        //make reference
        const storageRef = ref(
          storage,
          `posts/${Date.now()}-${imageFile.name}`,
        );
        //upload
        const uploadFile = await uploadBytesResumable(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadFile.ref);
      }
      await addDoc(collection(db, "posts"), {
        text: postText,
        postImage: imageUrl,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        profilePic: currentUser.profilePic,
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
        like: [],
        comments: [],
      });

      setPostText("");
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
      <div className="">
        <form
          onSubmit={handlePost}
          className="p-4 flex flex-col border-b-1 border-t-1 mt-5 border-gray-300"
          action=""
        >
          <div className="flex">
            <div className=" ">
              <div className="h-12 w-12 bg-gray-200 border border-gray-300 flex items-center justify-center rounded-full overflow-hidden  ">
                <FaUser className="text-gray-400 text-xl" />
              </div>
            </div>
            <div className="w-full">
              <textarea
                onChange={(e) => setPostText(e.target.value)}
                className="p-3 border-0  resize-none outline-0 border-gray-300 w-full"
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
                onChange={handleImageFile}
                className="hidden"
                id="post-image"
                type="file"
              />
              <label
                htmlFor="post-image"
                className="cursor-pointer text-3xl hover:bg-blue-100/50 hover:text-blue-500 rounded-full transition-all"
              >
                <FiImage />
              </label>
            </div>
            <input
              className={`${postText ? "bg-blue-500 text-white" : "bg-gray-300"} border cursor-pointer border-gray-300 rounded-4xl px-5 py-2`}
              type="submit"
              value={"Post"}
            />
          </div>
          {loading ? "Posting..." : " "}
        </form>
      </div>
      <div>
        {currentUserPost?.map((post) => {
          return (
            <div
              key={post.id}
              className="flex gap-3 px-3 py-6 border-b border-gray-200 hover:bg-gray-100/50 transition-colors cursor-pointer w-full"
            >
              {/* Left: Profile Image */}
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-300">
                  <FaUser />
                </div>
              </div>

              {/* Right: Content Section */}
              <div className="flex flex-col w-full">
                {/* Header: Name, Username, Time & More */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="font-bold text-[15px] hover:underline flex items-center gap-0.5">
                      {post.firstName} {post.lastName}
                      <MdVerified className="text-blue-500 text-[16px]" />
                    </span>
                    <span className="text-gray-500 text-[15px]">
                      @{post.firstName?.toLowerCase()}
                    </span>
                    <span className="text-gray-500 text-[15px]"> </span>
                  </div>
                  <HiOutlineDotsHorizontal className="text-gray-500 hover:text-blue-500 transition-colors" />
                </div>

                {/* Post Text */}
                <div className="text-[15px] text-black mt-0.5 leading-tight">
                  {post.text}{" "}
                  <span className="text-blue-500 hover:underline">
                    #ufcperth
                  </span>
                </div>

                {/* Icons Row */}
                <div className="flex items-center justify-between mt-3 text-gray-500 max-w-md">
                  {/* Comment */}
                  <div className="flex items-center gap-2 group">
                    <div className="p-2 group-hover:bg-blue-100/50 group-hover:text-blue-500 rounded-full transition-all">
                      <FaRegComment className="text-[16px]" />
                    </div>
                    <span className="text-[13px] group-hover:text-blue-500">
                      1.2K
                    </span>
                  </div>

                  {/* Retweet */}
                  <div className="flex items-center gap-2 group">
                    <div className="p-2 group-hover:bg-green-100/50 group-hover:text-green-500 rounded-full transition-all">
                      <FaRetweet className="text-[18px]" />
                    </div>
                    <span className="text-[13px] group-hover:text-green-500">
                      3.9K
                    </span>
                  </div>

                  {/* Like */}
                  <div className="flex items-center gap-2 group">
                    <div className="p-2 group-hover:bg-pink-100/50 group-hover:text-pink-500 rounded-full transition-all">
                      <FaRegHeart className="text-[16px]" />
                    </div>
                    <span className="text-[13px] group-hover:text-pink-500">
                      {post.like?.length || "54K"}
                    </span>
                  </div>

                  {/* Views/Stats */}
                  <div className="flex items-center gap-2 group">
                    <div className="p-2 group-hover:bg-blue-100/50 group-hover:text-blue-500 rounded-full transition-all">
                      <IoStatsChartOutline className="text-[16px]" />
                    </div>
                    <span className="text-[13px] group-hover:text-blue-500">
                      2.5M
                    </span>
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center">
                    <div className="p-2 hover:bg-blue-100/50 hover:text-blue-500 rounded-full transition-all">
                      <BsBookmark className="text-[16px]" />
                    </div>
                    <div className="p-2 hover:bg-blue-100/50 hover:text-blue-500 rounded-full transition-all">
                      <BsUpload className="text-[16px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default CreatePost;
