import { Link, useNavigate } from "react-router";
import React, { useEffect } from "react";
import { AuthContext } from "../context/authcontext";

const Home = () => {
  const auth = React.useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    if (!auth?.authenticated) nav("/signin");
  }, []);

  const handleLogout = () => {
    auth?.updateAuthenticated(false)
    nav('/signin')
  }

  return (
    <nav
      className="
    h-16 w-full flex bg-neutral-100 justify-center"
    >
      <div>
        <Link to={"/signup"}>Home</Link>
      </div>
      <div>
        <button className="border px-4 p-2 self-end" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Home;
