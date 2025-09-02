import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import { AuthContext } from "../context/authcontext";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { removeLocalStorage } = useLocalStorage();
  const handleEditClick = (e: React.MouseEvent) => {};
  const handleLogout = () => {
    auth?.updateAuthenticated(false);
    auth?.updateUser("", "");
    removeLocalStorage("JwtToken");
    navigate("/signin");
  };

  return (
    <div className="flex flex-col">
      <div className="w-full">{<Navbar activeHref="/account" />}</div>
      <div className="max-w-2xl mx-auto">
        <ProfileCard handleEditClick={handleEditClick} name="Joe Mama" handle="@mamajoe" />
        <button
          onClick={handleLogout}
          className="border w-52 rounded-md bg-red-400 py-4 mx-auto cursor-pointer font-inter text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;
