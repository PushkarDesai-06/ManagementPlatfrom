import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";

const Account = () => {
  const handleEditClick = () => {};

  return (
    <div className="flex flex-col bg-[#0a070f] min-h-screen">
      <div className="w-full">{<Navbar activeHref="/account" />}</div>
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
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
