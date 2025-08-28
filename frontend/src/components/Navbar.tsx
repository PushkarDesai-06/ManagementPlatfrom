import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import { AuthContext } from "../context/authcontext";
import useLocalStorage from "../hooks/useLocalStorage";
import { animate, motion, stagger } from "framer-motion";

import axios from "../lib/axios";

const Navbar = () => {
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

  animate("div", { opacity: 1 }, { delay: stagger(0.1, { startDelay: 0.2 }) });
  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="
        h-16 flex-1 flex bg-neutral-100 justify-between items-center px-4 top-0 border-b-neutral-300 border-b"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        // transition={{ delay: 0.5 }}
      >
        <Link to={"/signup"}>Home</Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        // transition={{ delay: 0.2 }}
      >
        <button className="border px-4 p-2 self-end" onClick={handleLogout}>
          Logout
        </button>
      </motion.div>
      <motion.div
        className="flex gap-2 items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        // transition={{ delay: 0.4 }}
      >
        <div>{auth?.name}</div>
        <div className="border rounded-full w-10 h-10"></div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
