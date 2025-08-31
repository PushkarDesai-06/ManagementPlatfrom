import React from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";

const Account = () => {
  const handleEditClick = (e: React.MouseEvent) => {};

  return (
    <div className="flex flex-col">
      <div className="w-full">{<Navbar activeHref="/account" />}</div>
      <div className="max-w-2xl mx-auto">
        <ProfileCard handleEditClick={handleEditClick} />
      </div>
    </div>
  );
};

export default Account;
