import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsUpload } from "react-icons/bs";
import { FaRegComment, FaRegHeart, FaRetweet, FaUser } from "react-icons/fa6";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoStatsChartOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { auth, db } from "../../Firebase";
import { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";

const PostCard = ({ currentUserPostsData }) => {
  const [commentText, setCommentText] = useState("");
  const [visibleComments, setVisibleComments] = useState(3);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const currentUser = auth.currentUser;
  const isLiked = currentUserPostsData.like.includes(currentUser?.uid);

  const loggedInUser = useSelector((state) => state.user.user);
  const alluserPostID = useSelector(
    (state) => state.allUsers.allUsersPostisIds,
  );

  //post like handler
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

  //   handle comment
  const handlePostComments = async (e, postId) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const postRef = doc(db, "posts", postId);
    //new Comment Object
    const newComment = {
      commentId: Date.now().toString(), //unique ID
      userID: auth.currentUser?.uid || "unknown",
      userName: `${loggedInUser?.firstName} ${loggedInUser?.lastName}`,
      userProfilePic: loggedInUser.profilePic,
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
  //delete current user post

  const deletePost = async (postId) => {
    const docRef = doc(db, "posts", postId);
    try {
      await deleteDoc(docRef);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div
        key={currentUserPostsData.postId}
        className="flex gap-3 px-3 py-6 bg-white rounded-3xl transition-colors cursor-pointer w-full"
      >
        {/* Right: Content Section */}
        <div className="flex flex-col w-full gap-4">
          {/* Header: Name, Username, Time & More */}
          <div className="flex justify-between items-center w-full">
            <div className="flex  items-center gap-3 flex-wrap">
              <div className="overflow-hidden h-10 w-10 rounded-full flex  items-center justify-center bg-gray-300">
                {currentUserPostsData.profilePic ? (
                  <img src={currentUserPostsData.profilePic} alt="" />
                ) : (
                  <FaUser />
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold lg:text-[15px] text-sm hover:underline flex  items-center gap-0.5">
                  {currentUserPostsData.firstName}{" "}
                  {currentUserPostsData.lastName}
                  <MdVerified className="text-blue-500 text-[16px]" />
                </span>
                <span className="text-gray-500 lg:text-[15px] text-sm">
                  @{currentUserPostsData.firstName?.toLowerCase()}
                </span>
              </div>
              <span className="text-gray-500 text-[15px]"> </span>
            </div>
            <div>
              {currentUser && (
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="">
                    <HiOutlineDotsHorizontal className="text-gray-500 hover:text-blue-500 transition-colors" />
                  </div>
                  <ul
                    tabIndex="-1"
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                  >
                    <li>
                      <a>Edit</a>
                    </li>
                    <li onClick={() => deletePost(currentUserPostsData.postId)}>
                      <a>Delete</a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Post Text */}
            <div className="lg:text-[15px] text-sm  text-black mt-0.5 leading-tight">
              {currentUserPostsData.text}
              <span className="text-blue-500 hover:underline">#ufcperth</span>
            </div>
            {/* post image */}
            <div className="lg:w-[50%] ">
              <img
                className="rounded-2xl"
                src={currentUserPostsData.postImage}
                alt=""
              />
            </div>
          </div>

          {/* Icons Row */}
          <div className="flex items-center gap-2 mt-3 text-gray-500 max-w-md">
            {/* Comment */}
            <div className="flex  items-center gap-2 group">
              <div
                onClick={() => {
                  setExpandedPostId(
                    expandedPostId == currentUserPostsData.postId
                      ? null
                      : currentUserPostsData.postId,
                  );
                }}
                className="  p-0 group-hover:bg-blue-100/50 group-hover:text-blue-500 rounded-full transition-all"
              >
                <FaRegComment className="text-[16px]" />
              </div>
              <span className="text-[13px] group-hover:text-blue-500">
                {currentUserPostsData.comments.length}
              </span>
            </div>

            {/* Like */}
            <div className="flex  items-center gap-2 group">
              <div
                onClick={() =>
                  handlePostLike(currentUserPostsData.postId, isLiked)
                }
                className=" p-0 group-hover:bg-pink-100/50 group-hover:text-pink-500 rounded-full transition-all"
              >
                {isLiked ? (
                  <AiFillHeart className="text-red-500 text-2xl" /> // Red Dil
                ) : (
                  <AiOutlineHeart className="text-2xl" /> // Khali Dil
                )}
              </div>
              <span className="text-[13px] group-hover:text-pink-500">
                {currentUserPostsData.like?.length || "0"}
              </span>
            </div>

            {/* Action Icons */}
          </div>
          {expandedPostId === currentUserPostsData.postId && (
            <form
              onSubmit={(e) =>
                handlePostComments(e, currentUserPostsData.postId)
              }
              action=""
            >
              <div className="mt-5 relative">
                <input
                  onChange={(e) => setCommentText(e.target.value)}
                  className=" border-gray-200 lg:px-7 lg:py-2 px-5 py-2 text-sm outline-0 rounded-full w-full"
                  type="text"
                  placeholder="Enter Your Comment"
                  value={commentText}
                />
                {commentText && (
                  <button
                    className="absolute right-5 top-2 text-white bg-blue-400 px-3 rounded-full cursor-pointer"
                    type="submit"
                  >
                    comment
                  </button>
                )}
              </div>
            </form>
          )}
          {expandedPostId === currentUserPostsData.postId && (
            <div>
              <div className="mt-5">
                {currentUserPostsData.comments
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
                          <div className="flex  items-center gap-2">
                            <span className="font-bold text-[14px] hover:underline cursor-pointer">
                              {comment.userName}
                            </span>
                            <span className="text-gray-500 text-[12px]">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[14px] text-gray-800 mt-0.5 leading-relaxed">
                            {comment.text}
                          </p>

                          {/* Optional: Comment Actions (Like/Reply for comment) */}
                          <div className="flex  items-center gap-4 mt-2 text-gray-500">
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
              {currentUserPostsData.comments?.length > visibleComments ? (
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
};
export default PostCard;
