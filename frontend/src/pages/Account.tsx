import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import { AuthContext } from "../context/authcontext";

const Account = () => {
  const handleEditClick = () => {};
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("JwtToken");

    // Update auth context
    auth?.updateAuthenticated(false);
    auth?.updateUser("", "");

    // Redirect to signin
    navigate("/signin");
  };

  return (
    <div className="flex flex-col bg-[#0a070f] min-h-screen">
      <div className="w-full">{<Navbar activeHref="/account" />}</div>
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
        <ProfileCard
          handleEditClick={handleEditClick}
          name="Joe Mama"
          handle="@mamajoe"
          city="Mumbai"
          countryCode="IN"
          description="Managing my life, one task at a time"
        />
        <button
          onClick={handleLogout}
          className="border border-[#2d2740] w-full mt-4 rounded-lg bg-[#1a1625] hover:bg-[#201a2e] py-3 cursor-pointer text-[#c4b8e0] transition text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;
