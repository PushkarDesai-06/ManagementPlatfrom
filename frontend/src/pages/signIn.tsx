import React, { useEffect, useState } from "react";
import { type formDataInterface } from "../types/types";
import { Link, useNavigate } from "react-router-dom";
import { AlertContext } from "../context/alertContext";
import { AuthContext } from "../context/authcontext";
import Beams from "../blocks/Backgrounds/Beams/Beams";
import axios from "../lib/axios";
import useLocalStorage from "../hooks/useLocalStorage";
import { isAxiosError } from "axios";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const auth = React.useContext(AuthContext);
  const { openAlert } = React.useContext(AlertContext);
  const navigate = useNavigate();
  const { setLocalStorage, getLocalStorage, removeLocalStorage } =
    useLocalStorage();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const req = await axios.get(`/auth/get-info`);
        if (req.data.authenticated) {
          auth?.updateAuthenticated(true);
          auth?.updateUser(req.data.name, req.data.email);
          navigate("/");
          return;
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          if (error.response && error.response.status === 401) {
            auth?.updateAuthenticated(false);
            auth?.updateUser("", "");
            openAlert("Login Error!", "You have to re-login to continue");
          } else {
            auth?.updateAuthenticated(false);
            auth?.updateUser("", "");
            openAlert("Session Expired!", "You have to re-login to continue");
          }

          console.log(error);
          removeLocalStorage("JwtToken");
          console.log("removed Token");
        }
      }
    };

    if (auth?.authenticated) navigate("/");
    else if (getLocalStorage("JwtToken")) {
      verifyToken(getLocalStorage("JwtToken"));
    }
  }, []);

  const [formData, setFormData] = useState<formDataInterface>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", formData);
      setLoading(false);
      if (res.status === 200 && res.data.authenticated === true) {
        auth?.updateAuthenticated(true);
        auth?.updateUser(res.data.name, res.data.email);
        setError(false);
        navigate("/");
      } else if (res.data.status === 200) {
        auth?.updateAuthenticated(false);
        openAlert(
          "Authentication Failed",
          "Failed to authorise user : wrong username or password"
        );
      } else {
        setError(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      openAlert("Server Error", "Failed to sign in, try again later");
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 w-screen min-h-screen bg-[#0a070f]">
        <div className="absolute w-screen h-screen z-0 opacity-30">
          <Beams
            beamWidth={3}
            beamHeight={12}
            beamNumber={8}
            lightColor="#7c6ba8"
            speed={1.5}
            noiseIntensity={1.2}
            scale={0.15}
            rotation={45}
          />
        </div>

        {/* Left side branding - hidden on mobile */}
        <div className="hidden lg:flex items-center justify-end flex-1 z-10">
          <h1 className="text-4xl text-center p-6 px-10 rounded-lg bg-[#1a1625] border border-[#2d2740] w-72">
            <p className="font-poppins text-[#e8e3f5] font-semibold">Manage</p>
            <p className="text-[#8b7fb8] text-2xl">Your Life</p>
          </h1>
        </div>

        {/* Mobile branding - top of page */}
        <div className="lg:hidden flex justify-center pt-8 pb-4 z-10">
          <h1 className="text-3xl text-center p-4 px-8 rounded-lg bg-[#1a1625] border border-[#2d2740]">
            <p className="font-poppins text-[#e8e3f5] font-semibold">Manage</p>
            <p className="text-[#8b7fb8] text-xl">Your Life</p>
          </h1>
        </div>

        {/* Right side form */}
        <div className="flex-1 flex items-center justify-center z-10 px-4 pb-8 lg:pb-0">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 w-full max-w-md flex flex-col gap-3 rounded-lg bg-[#1a1625] border border-[#2d2740]"
          >
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-[#e8e3f5] mb-1">
                Sign In
              </h2>
              <p className="text-sm text-[#6b5f88]">Welcome back to TaskFlow</p>
            </div>
            <label
              htmlFor="email"
              className="font-medium text-sm text-[#c4b8e0]"
            >
              Email
            </label>
            <input
              type="email"
              autoComplete="true"
              required={true}
              name=""
              id="email"
              value={formData.email}
              autoFocus={true}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter your email"
              className="px-3 py-2.5 rounded-lg mb-3 bg-[#0f0b16] text-[#e8e3f5] border border-[#2d2740] placeholder-[#5a4f73] outline-none focus:border-[#7c6ba8] transition"
            />
            <label
              htmlFor="password"
              className="font-medium text-sm text-[#c4b8e0]"
            >
              Password
            </label>
            <input
              type="password"
              required={true}
              minLength={6}
              name=""
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              id="password"
              placeholder="Enter Password"
              className="px-3 py-2.5 rounded-lg mb-3 bg-[#0f0b16] text-[#e8e3f5] border border-[#2d2740] placeholder-[#5a4f73] outline-none focus:border-[#7c6ba8] transition"
            />
            {error && (
              <h1 className="text-center text-[#c77272] mb-2 text-sm">
                Wrong username or password!
              </h1>
            )}
            <button
              className="bg-[#7c6ba8] hover:bg-[#8b7fb8] rounded-lg w-full py-2.5 transition text-[#e8e3f5] font-medium mt-2"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <div className="text-[#8b7fb8] text-center text-sm mt-2">
              <span>New Here? </span>
              <Link to={"/signup"}>
                <span className="hover:text-[#a395c9] transition cursor-pointer">
                  Sign up
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
