import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authcontext";
import { Link, useNavigate } from "react-router-dom";
import Beams from "../blocks/Backgrounds/Beams/Beams";
import axios from "../lib/axios";
import { AlertContext } from "../context/alertContext";

const SignUp = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { openAlert } = useContext(AlertContext);

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
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/auth/register", formData);

      if (res.status == 200 && res.data.token) {
        // Store token in localStorage
        localStorage.setItem("JwtToken", res.data.token);

        setLoading(false);
        openAlert("Success", "Account created successfully! Please sign in.");
        navigate("/signin");
      } else {
        auth?.updateAuthenticated(false);
        setLoading(false);
        console.log("Error");
      }
    } catch (error) {
      auth?.updateAuthenticated(false);
      setLoading(false);
      openAlert(
        "Server Error",
        `Could not connect to server. Please try again later ${error}`
      );
    }
  };

  return (
    <div className="flex gap-4 w-screen min-h-screen bg-[#0a070f]">
      <div className="absolute w-screen h-screen z-0 opacity-30">
        <Beams
          beamWidth={3}
          beamHeight={12}
          beamNumber={8}
          lightColor="#7c6ba8"
          speed={1.5}
          noiseIntensity={1.2}
          scale={0.15}
          rotation={-45}
        />
      </div>

      <div className="flex items-center justify-end flex-1/2 z-10">
        <h1 className="text-4xl text-center p-6 px-10 rounded-lg bg-[#1a1625] border border-[#2d2740] w-72">
          <p className="font-poppins text-[#e8e3f5] font-semibold">Manage</p>
          <p className="text-[#8b7fb8] text-2xl">Your Life</p>
        </h1>
      </div>
      <div className="right flex-1/2 flex items-center z-10">
        <form
          onSubmit={handleSubmit}
          className="p-8 m-4 flex flex-col gap-3 rounded-lg sm:w-sm md:w-lg bg-[#1a1625] border border-[#2d2740]"
        >
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-[#e8e3f5] mb-1">
              Sign Up
            </h2>
            <p className="text-sm text-[#6b5f88]">
              Create your TaskFlow account
            </p>
          </div>
          <label htmlFor="name" className="font-medium text-sm text-[#c4b8e0]">
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
            className="px-3 py-2.5 rounded-lg mb-3 bg-[#0f0b16] text-[#e8e3f5] border border-[#2d2740] placeholder-[#5a4f73] outline-none focus:border-[#7c6ba8] transition"
          />
          <label htmlFor="email" className="font-medium text-sm text-[#c4b8e0]">
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
            name=""
            required={true}
            minLength={6}
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            id="password"
            placeholder="Enter Password"
            className="px-3 py-2.5 rounded-lg mb-3 bg-[#0f0b16] text-[#e8e3f5] border border-[#2d2740] placeholder-[#5a4f73] outline-none focus:border-[#7c6ba8] transition"
          />

          <button
            className="bg-[#7c6ba8] hover:bg-[#8b7fb8] rounded-lg w-full py-2.5 transition text-[#e8e3f5] font-medium mt-2"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
          <div className="text-[#8b7fb8] text-center text-sm mt-2">
            <span>Already have an account? </span>
            <Link to={"/signin"}>
              <span className="hover:text-[#a395c9] transition cursor-pointer">
                Sign in
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
