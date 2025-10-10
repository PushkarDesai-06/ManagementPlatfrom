import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import { AuthContext } from "../context/authcontext";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const Account = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const handleEditClick = (e: React.MouseEvent) => {};

  return (
    <div className="flex flex-col bg-[#0a070f] min-h-screen">
      <div className="w-full">{<Navbar activeHref="/account" />}</div>
      <div className="max-w-2xl mx-auto p-8">
        <ProfileCard
          handleEditClick={handleEditClick}
          name="Joe Mama"
          handle="@mamajoe"
        />
        <button className="border border-[#2d2740] w-full mt-4 rounded-lg bg-[#1a1625] hover:bg-[#201a2e] py-3 cursor-pointer text-[#c4b8e0] transition text-sm font-medium">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;
