import { Link, useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import { AuthContext } from "../context/authcontext";
import useLocalStorage from "../hooks/useLocalStorage";
import axios from "../lib/axios";

const Home = () => {
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();
  const { getLocalStorage, setLocalStorage, removeLocalStorage } =
    useLocalStorage();

  const handleLogout = () => {
    auth?.updateAuthenticated(false);
    auth?.updateUser("", "");
    removeLocalStorage("JwtToken");
    navigate("/signin");
  };

  return (
    <nav
      className="
    h-16 w-full flex bg-neutral-100 justify-center"
    >
      <div>
        <Link to={"/signup"}>Home</Link>
      </div>
      <div>{auth?.name}</div>
      <div>
        <button className="border px-4 p-2 self-end" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Home;
