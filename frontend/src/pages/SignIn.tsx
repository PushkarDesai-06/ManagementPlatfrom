import React, { useEffect, useRef, useState } from "react";
import { type formDataInterface } from "../types/types";
import { Link, useNavigate } from "react-router";
import { AlertContext } from "../context/alertContext";
import { AuthContext } from "../context/authcontext";
import Beams from "../blocks/Backgrounds/Beams/Beams";
import axios from "../lib/axios";
import useLocalStorage from "../hooks/useLocalStorage";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const auth = React.useContext(AuthContext);
  const { openAlert } = React.useContext(AlertContext);
  const navigate = useNavigate();
  const { setLocalStorage, getLocalStorage, removeLocalStorage } =
    useLocalStorage();

  useEffect(() => {
    const verifyToken = async (JwtToken: string) => {
      try {
        const req = await axios.get(`/get-info`, {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
          },
        });
        if (req.data.status === 200 && req.data.authenticated) {
          auth?.updateAuthenticated(true);
          auth?.updateUser(req.data.name, req.data.email);
          navigate("/");
          return;
        } else if (req.data.status === 401) {
          auth?.updateAuthenticated(false);
          auth?.updateUser(null, null);
          openAlert("Login Error!", "You have to re-login to continue");
        } else {
          auth?.updateAuthenticated(false);
          auth?.updateUser(null, null);
          openAlert("Session Expired!", "You have to re-login to continue");
        }
      } catch (error) {
        console.log(error);
        removeLocalStorage("JwtToken");
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
    const res = await axios.post("/login", formData);
    setLoading(false);
    if (res.data.status === 200 && res.data.authenticated === true) {
      auth?.updateAuthenticated(true);
      auth?.updateUser(res.data.name, res.data.email);
      setError(false);
      setLocalStorage("JwtToken", res.data.token);
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
  };

  return (
    <>
      <div className="flex gap-4 w-screen min-h-screen">
        <div className="absolute w-screen h-screen z-0">
          <Beams
            beamWidth={2}
            beamHeight={15}
            beamNumber={12}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={0}
          />
        </div>

        <div className="flex items-center justify-end flex-1/2 z-10">
          <h1 className="font-ubuntu text-4xl text-center text-transparent p-4 px-8 rounded-xl backdrop-blur-2xl border-2 border-neutral-600 bg-gradient-to-r from-neutral-500/20 via-neutral-300 to-neutral-500/20 bg-clip-text w-64">
            <p className="font-poppins">Manage</p>Your Life
          </h1>
        </div>
        <div className="right flex-1/2 flex items-center z-10 ">
          <form
            onSubmit={handleSubmit}
            className=" p-8 border-neutral-600/30 m-4 flex flex-col gap-2 rounded-lg sm:w-sm md:w-lg backdrop-brightness-50 backdrop-blur-lg border-2"
          >
            <label
              htmlFor="email"
              className="font-semibold text-xl text-white/80 drop-shadow-lg drop-shadow-black/20"
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter your email"
              className=" p-2 rounded-md mb-4 text-white/90 ring-1 ring-white/30"
            />
            <label
              htmlFor="password"
              className="font-semibold text-xl text-white/80 drop-shadow-lg drop-shadow-black"
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
              className=" p-2 rounded-md mb-4 text-white/90 ring-1 ring-white/30"
            />
            {error && (
              <h1 className="text-center text-red-600 mb-4 animate-pulse">
                Wrong username or password!
              </h1>
            )}
            <button className="bg-green-300/10 rounded-xl w-full mb-2">
              <h1 className="border p-2 px-4 rounded-xl text-neutral-200">{`${
                loading ? "loading..." : "Sign In"
              }`}</h1>
            </button>
            <div className="text-neutral-300  text-center">
              <span>New Here?</span>
              <Link to={"/signup"}>
                <p className="hover:text-blue-300 transition">Sign up</p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
