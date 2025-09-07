import React, { useEffect, useState } from "react";
import { AuthContext } from "../context/authcontext";
import { Link, useNavigate } from "react-router-dom";
import Beams from "../blocks/Backgrounds/Beams/Beams";
import axios from "../lib/axios";
import { AlertContext } from "../context/alertContext";

const SignUp = () => {
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { openAlert } = React.useContext(AlertContext);

  useEffect(() => {
    if (auth?.authenticated) navigate("/");
  }, []);

  interface formDataInterface {
    name: string;
    email: string;
    password: string;
  }

  const [formData, setFormData] = useState<formDataInterface>({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const res = await axios.post("/auth/register", formData);

      if (res.data.status == 200) {
        navigate("/signin");
      } else {
        auth?.updateAuthenticated(false);
        console.log("Error");
      }
    } catch (error) {
      auth?.updateAuthenticated(false);
      openAlert("Server Error" , 'Could not connect to server. Please try again later');
    }
  };

  return (
    <div className="flex gap-4 w-screen min-h-screen">
      <div className="absolute w-screen h-screen z-0">
        <Beams
          beamWidth={4}
          beamHeight={15}
          beamNumber={12}
          lightColor="#00E9FF"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={-45}
        />
      </div>

      <div
        className="flex items-center justify-end flex-1/2 z-10
			"
      >
        <h1 className="font-ubuntu text-4xl text-center text-transparent  p-4 px-8 rounded-xl backdrop-blur-2xl border-2 border-neutral-600 bg-gradient-to-r  from-neutral-500/20 via-neutral-300 to-neutral-500/20 bg-clip-text w-64">
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
            className="font-bold text-xl text-white/80 drop-shadow-lg drop-shadow-black/20"
          >
            Name
          </label>
          <input
            type="text"
            name=""
            minLength={4}
            required={true}
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter your name"
            className=" p-2 rounded-md mb-4 text-white/90 ring-1 ring-white/30"
          />
          <label
            htmlFor="email"
            className="font-bold text-xl text-white/80 drop-shadow-lg drop-shadow-black/20"
          >
            Email
          </label>
          <input
            type="email"
            name=""
            required={true}
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
            className="font-bold text-xl text-white/80 drop-shadow-lg drop-shadow-black"
          >
            Password
          </label>
          <input
            type="password"
            name=""
            required={true}
            minLength={6}
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            id="password"
            placeholder="Enter Password"
            className=" p-2 rounded-md mb-4 text-white/90 ring-1 ring-white/30"
          />

          <button className="bg-orange-300/10 rounded-xl w-full mb-2">
            <h1 className="border p-2 px-4 rounded-xl text-neutral-200">{`${
              loading ? "loading..." : "Sign Up"
            }`}</h1>
          </button>
          <div className="text-neutral-300  text-center">
            <span>Already have an account?</span>
            <Link to={"/signin"}>
              <p className="hover:text-blue-300 transition">Sign in</p>{" "}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
