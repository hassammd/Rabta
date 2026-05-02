import { useEffect, useState } from "react";
import { db } from "../../Firebase";
import { doc, updateDoc } from "firebase/firestore";

const PopUpBox = ({ setIsBoxActive, currentUser }) => {
  console.log("this is user Data from popup:", currentUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("this is current user");
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setBio(currentUser.bio);
    }
  }, [useState]);
  const handleOverlayClick = (e) => {
    if (e.target == e.currentTarget) {
      setIsBoxActive(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        firstName: firstName,
        lastName: lastName,
        bio: bio,
      });
      setIsBoxActive(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={handleOverlayClick}
        className="fixed cursor-pointer bg-black/80  inset-0 flex items-center justify-center"
      >
        <div className="z-50  bg-white px-20 h-[500px] w-[450px] flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold font-black mb-7">Edit Profile</h1>
          <form
            onSubmit={handleUpdate}
            className="w-full flex flex-col gap-3"
            action=""
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                First Name
              </label>
              <input
                onChange={(e) => setFirstName(e.target.value)}
                className="py-1 px-4 outline-0 border-gray-300 rounded-xl"
                type="text"
                value={firstName}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Last Name
              </label>
              <input
                onChange={(e) => setLastName(e.target.value)}
                className="py-1 px-4 outline-0 border-gray-300 rounded-xl"
                type="text"
                value={lastName}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Bio
              </label>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                className="py-1 px-4 outline-0 border-gray-300 rounded-xl"
                type="text"
                value={bio}
              />
            </div>
            <div>
              <input
                className="bg-[#3B82F6] w-full text-sm text-white uppercase cursor-pointer lg:p-2 p-1 border outline-0 border-gray-200 rounded-lg"
                type="submit"
                name="Edit"
                value={"edit"}
              />
            </div>
          </form>
          {loading ? "Updating..." : "Save Changes"}
        </div>
      </div>
    </>
  );
};
export default PopUpBox;
