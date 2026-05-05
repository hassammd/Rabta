import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import Profile from "./Profile";
import { IoHomeOutline, IoStatsChartOutline } from "react-icons/io5";
import { FiUserPlus } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import Navbar from "../Components/Navbar";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../Firebase";
import CreatePost from "../Components/CreatePost";
import { FaRegComment, FaRegHeart, FaRetweet, FaUser } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BsBookmark, BsUpload } from "react-icons/bs";
const Home = () => {
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUserPosts, setAllUserPosts] = useState(null);
  console.log("All user posts", allUserPosts);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      console.log("this is user from auth", user);
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      console.log("this is doc Snap", docSnap);
      if (docSnap.exists()) {
        setCurrentUser(docSnap.data());
      }
    };
    fetchCurrentUser();
  }, []);
  ///fetch all users Posts

  useEffect(() => {
    const fetchAllUsersPosts = async () => {
      const docsRef = collection(db, "posts");
      const docsSnap = await getDocs(docsRef);
      console.log("these are all user posts", docsSnap);
      const posts = docsSnap.docs.map((items) => {
        console.log("thieasdfasdf", items);
        return {
          postId: items.id,
          ...items.data(),
        };
      });
      setAllUserPosts(posts);
    };
    fetchAllUsersPosts();
  }, []);

  return (
    <>
      {/* <CreatePost currentUser={currentUser} /> */}
      <h1>All user Posts</h1>
      {allUserPosts?.map((items) => {
        return (
          <div
            key={items.id}
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
                    {items.firstName} {items.lastName}
                    <MdVerified className="text-blue-500 text-[16px]" />
                  </span>
                  <span className="text-gray-500 text-[15px]">
                    @{items.firstName?.toLowerCase()}
                  </span>
                  <span className="text-gray-500 text-[15px]"> </span>
                </div>
                <HiOutlineDotsHorizontal className="text-gray-500 hover:text-blue-500 transition-colors" />
              </div>

              {/* Post Text */}
              <div className="text-[15px] text-black mt-0.5 leading-tight">
                {items.text}{" "}
                <span className="text-blue-500 hover:underline">#ufcperth</span>
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
                    {items.like?.length || "54K"}
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
    </>
  );
};

export default Home;
