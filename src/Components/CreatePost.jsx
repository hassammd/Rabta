import { useEffect, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { FaUser } from "react-icons/fa6";
import { FiImage } from "react-icons/fi";
import { MdOutlineGifBox } from "react-icons/md";
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
import { db } from "../../Firebase";

const CreatePost = ({ currentUser }) => {
  const [postText, setPostText] = useState("");
  const [currentUserPost, setCurrentUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  //add post handler
  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        text: postText,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        profilePic: currentUser.profilePic,
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
        like: [],
        comments: [],
      });
      setPostText("");
      alert("Post Shared!");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //get post handler

  useEffect(() => {
    const fetchCurrentUserPosts = async () => {
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
        console.log("postsssssssss", postsData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCurrentUserPosts();
  }, [currentUser?.uid]);

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
              <div className="h-12 w-12 bg-gray-200 border border-gray-300 flex items-center justify-center rounded-full overflow-hidden flex-shrink-0">
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
                placeholder=" What's happening?"
              ></textarea>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <FiImage />
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
        {currentUserPost.map((items) => {
          return <p>{items.text}</p>;
        })}
      </div>
    </>
  );
};
export default CreatePost;
