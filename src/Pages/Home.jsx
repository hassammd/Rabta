import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import Profile from "./Profile";
import { IoHomeOutline } from "react-icons/io5";
import { FiUserPlus } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import Navbar from "../Components/Navbar";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../Firebase";
import CreatePost from "../Components/CreatePost";
const Home = () => {
  const [userList, setUserList] = useState([]);
  console.log("this is user list", userList);

  return (
    <>
      <CreatePost />
    </>
  );
};

export default Home;
