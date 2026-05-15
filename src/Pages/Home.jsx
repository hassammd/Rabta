import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import Profile from "./Profile";
import { IoHomeOutline, IoStatsChartOutline } from "react-icons/io5";
import { FiUserPlus } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import Navbar from "../Components/Navbar";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../Firebase";
import CreatePost from "../Components/CreatePost";
import { FaRegComment, FaRegHeart, FaRetweet, FaUser } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BsBookmark, BsUpload } from "react-icons/bs";

import { onAuthStateChanged } from "firebase/auth";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { allUsersPostisIds, allUsersPosts } from "../Redux/allUsersSlice";

const Home = () => {
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [allUserPosts, setAllUserPosts] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [visibleComments, setVisibleComments] = useState(3);
  const [isMobileNav, setIsMobileNav] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //toggle comments

  //handle Post like
  const handlePostLike = async (id, isLiked) => {
    const postRef = doc(db, "posts", id);

    try {
      if (isLiked) {
        await updateDoc(postRef, { like: arrayRemove(auth.currentUser.uid) });
      } else {
        await updateDoc(postRef, {
          like: arrayUnion(auth.currentUser.uid),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePostComments = async (e, postId) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const postRef = doc(db, "posts", postId);
    //new Comment Object
    const newComment = {
      commentId: Date.now().toString(), //unique ID
      userID: currentUser.uid,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      userProfilePic: currentUser.profilePic,
      text: commentText,
      createdAt: new Date().toISOString(),
    };
    try {
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });
      console.log("comment added");
      setCommentText("");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCurrentUser(docSnap.data());
        }
      }
      return () => unsubscribe();
    });
  }, []);

  // Fetch All Posts & Dispatch IDs to Redux

  useEffect(() => {
    let unsubscribe; // 1. Variable ko bahar define karein

    const fetchAllUsersPosts = () => {
      setIsFetching(true);
      try {
        const docsRef = collection(db, "posts");

        unsubscribe = onSnapshot(
          docsRef,
          (snapshot) => {
            const posts = snapshot.docs.map((doc) => ({
              postId: doc.id,
              ...doc.data(),
            }));
            //Algoritgn Start
            const sortedPosts = posts.sort((a, b) => {
              console.log("this is a post", a);
              //calculate the score of likes and comments
              const scoreA =
                (a.likes?.length || 0) * 2 + (a.comments?.length || 0) * 3;
              const scoreB =
                (b.likes?.length || 0) * 2 + (b.comments?.length || 0) * 3;
              //step 1 Popularity check
              if (scoreB !== scoreA) {
                return scoreB - scoreA;
              }
              //step 2 if score is equal then sort according to the timespam
              return b.createdAt - a.createdAt;
            });
            setAllUserPosts(sortedPosts);

            // IDs dispatch logic
            const postIds = posts.map((post) => post.postId);
            dispatch(allUsersPostisIds(postIds));

            // 3. Loading yahan band karein jab data mil jaye
            setIsFetching(false);
          },
          (error) => {
            console.log(error);
            setIsFetching(false);
          },
        );
      } catch (err) {
        console.log(err);
        setIsFetching(false);
      }
    };

    fetchAllUsersPosts();

    // 4. Cleanup function sahi tareeke se return karein
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);
  if (isFetching)
    return (
      <h1 className="p-10 text-center font-bold">
        <span className="loading loading-spinner text-info"></span>
      </h1>
    );
  return (
    <>
      {/* <CreatePost currentUser={currentUser} /> */}
      {/* <h1>All user Posts</h1>  */}
      <div className="hidden lg:block flex justify-between items-center bg-gray-100 border-b-1 border-gray-300 px-3.5 py-4">
        <span className="text-black font-semibold">For You</span>
      </div>

      {allUserPosts?.map((items) => {
        const isLiked = items.like.includes(currentUser?.uid);

        return (
          <>
            <div
              // onClick={() => navigate(`/profile/${items.uid}`)}
              key={items.postId}
              className="flex gap-3 px-3 py-6 border-b border-gray-200 hover:bg-gray-100/50 transition-colors cursor-pointer w-full"
            >
              {/* Left: Profile Image */}
              <div className="flex-shrink-0">
                <div className="overflow-hidden h-10 w-10 rounded-full flex items-center justify-center bg-gray-300">
                  {items.profilePic ? (
                    <img src={items.profilePic} alt="" />
                  ) : (
                    <FaUser />
                  )}
                </div>
              </div>

              {/* Right: Content Section */}
              <div className="flex flex-col w-full">
                {/* Header: Name, Username, Time & More */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span
                      onClick={() => navigate(`/profile/${items.uid}`)}
                      className="font-bold lg:text-[15px] text-sm hover:underline flex items-center gap-0.5"
                    >
                      {items.firstName} {items.lastName}
                      <MdVerified className="text-blue-500 text-[16px]" />
                    </span>
                    <span className="text-gray-500 lg:text-[15px] text-sm">
                      @{items.firstName?.toLowerCase()}
                    </span>
                    <span className="text-gray-500 lg:text-[15px] text-sm">
                      {" "}
                    </span>
                  </div>
                  <HiOutlineDotsHorizontal className="text-gray-500 hover:text-blue-500 transition-colors" />
                </div>

                <div className="flex flex-col gap-4">
                  {/* Post Text */}
                  <div className="lg:text-[15px] text-sm text-black mt-2 leading-tight">
                    {items.text}
                  </div>
                  {/* post image */}
                  <div>
                    <img
                      className="rounded-xl"
                      src={items.postImage}
                      alt="img"
                    />
                  </div>
                </div>

                {/* Icons Row */}
                <div className="flex items-center gap-2  mt-3 text-gray-500 max-w-md">
                  {/* Comment */}
                  <div className="flex items-center lg:gap-1 gap-0 group">
                    <div
                      onClick={() => {
                        setExpandedPostId(
                          expandedPostId == items.postId ? null : items.postId,
                        );
                      }}
                      className="    group-hover:bg-blue-100/50 group-hover:text-blue-500 rounded-full transition-all"
                    >
                      <FaRegComment className="lg:text-[16px]" />
                    </div>
                    <span className="text-[13px] group-hover:text-blue-500">
                      {items.comments.length}
                    </span>
                  </div>

                  {/* Like */}
                  <div className="flex items-center lg:gap-1 gap-0.5 group">
                    <div
                      onClick={() => handlePostLike(items.postId, isLiked)}
                      className=" group-hover:bg-pink-100/50 group-hover:text-pink-500 rounded-full transition-all"
                    >
                      {isLiked ? (
                        <AiFillHeart className="text-red-500 text-2xl" /> // Red heart
                      ) : (
                        <AiOutlineHeart className="text-2xl" /> // Khali heart
                      )}
                    </div>
                    <span className="text-[13px] group-hover:text-pink-500">
                      {items.like?.length || "0"}
                    </span>
                  </div>
                </div>
                {expandedPostId === items.postId && (
                  <form
                    onSubmit={(e) => handlePostComments(e, items.postId)}
                    action=""
                  >
                    <div className="relative">
                      <input
                        onChange={(e) => setCommentText(e.target.value)}
                        className=" border-gray-200 lg:px-7 lg:py-2 px-4 py-2 text-sm outline-0 rounded-full w-full"
                        type="text"
                        placeholder="Enter Your Comment"
                        value={commentText}
                      />
                      {commentText && (
                        <button
                          className=" absolute lg:right-5 lg:top-2 right-5 top-3 text-white bg-blue-400 py-0 px-3 text-sm rounded-full cursor-pointer"
                          type="submit"
                        >
                          comment
                        </button>
                      )}
                    </div>
                  </form>
                )}
                {expandedPostId === items.postId && (
                  <div>
                    <div className="mt-5">
                      {items.comments
                        .slice(0, visibleComments)
                        .map((comment) => {
                          return (
                            <div
                              key={comment.commentId}
                              className="flex gap-3 group animate-fadeIn"
                            >
                              {/* Commenter Avatar */}
                              <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-300">
                                <img
                                  src={
                                    comment.userProfilePic ||
                                    "https://via.placeholder.com/150"
                                  }
                                  alt={comment.userName}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              {/* Comment Content Bubble */}
                              <div className="flex-1 flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[14px] hover:underline cursor-pointer">
                                    {comment.userName}
                                  </span>
                                  <span className="text-gray-500 text-[12px]">
                                    {new Date(
                                      comment.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-[14px] text-gray-800 mt-0.5 leading-relaxed">
                                  {comment.text}
                                </p>

                                {/* Optional: Comment Actions (Like/Reply for comment) */}
                                <div className="flex items-center gap-4 mt-2 text-gray-500">
                                  <button className="hover:text-pink-500 transition-colors">
                                    <FaRegHeart className="text-[12px]" />
                                  </button>
                                  <button className="text-[12px] hover:underline">
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {items.comments.length > visibleComments ? (
                      <div className="pt-5">
                        <button
                          onClick={() => setVisibleComments((prev) => prev + 3)}
                          className="text-blue-500 text-sm font-bold mt-2 hover:underline cursor-pointer"
                        >
                          Show more comments...
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-2"></p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

export default Home;
