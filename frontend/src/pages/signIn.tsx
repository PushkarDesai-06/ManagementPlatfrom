import { useEffect, useState, useContext } from "react";
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
  const auth = useContext(AuthContext);
  const { openAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const { getLocalStorage, removeLocalStorage } = useLocalStorage();

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
    else {
      const token = getLocalStorage("JwtToken");
      if (token) {
        verifyToken();
      }
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
        // Store token in localStorage
        localStorage.setItem("JwtToken", res.data.token);

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
      <div className="relative flex items-center justify-center w-screen min-h-screen bg-linear-to-br from-[#0a070f] via-[#13111c] to-[#0a070f] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-20">
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

        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Branding */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-block p-3 rounded-2xl bg-linear-to-br from-[#7c6ba8] to-[#5a4976] shadow-lg shadow-purple-900/30">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-3xl">📝</span>
                </div>
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#e8e3f5] mb-4 font-poppins">
                  Welcome to
                  <span className="block bg-linear-to-r from-[#a395c9] to-[#7c6ba8] bg-clip-text text-transparent">
                    TaskFlow
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-[#8b7fb8] max-w-md mx-auto lg:mx-0">
                  Organize your life, boost productivity, and achieve more with
                  our intuitive task management platform.
                </p>
              </div>

              <div className="hidden lg:flex gap-4 pt-4">
                <div className="flex-1 p-4 rounded-xl bg-[#1a1625]/50 border border-[#2d2740]">
                  <div className="text-2xl mb-2">⚡</div>
                  <p className="text-sm text-[#c4b8e0]">Fast & Efficient</p>
                </div>
                <div className="flex-1 p-4 rounded-xl bg-[#1a1625]/50 border border-[#2d2740]">
                  <div className="text-2xl mb-2">🔒</div>
                  <p className="text-sm text-[#c4b8e0]">Secure & Private</p>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full">
              <form
                onSubmit={handleSubmit}
                className="p-8 sm:p-10 w-full rounded-2xl bg-[#1a1625]/80 backdrop-blur-xl border border-[#2d2740] shadow-2xl shadow-purple-900/20"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-[#e8e3f5] mb-2">
                    Sign In
                  </h2>
                  <p className="text-[#8b7fb8]">
                    Welcome back! Ready to be productive?
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-medium text-sm text-[#c4b8e0] mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      required={true}
                      id="email"
                      value={formData.email}
                      autoFocus={true}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#0f0b16] text-[#e8e3f5] border border-[#2d2740] placeholder-[#5a4f73] outline-none focus:border-[#7c6ba8] focus:ring-2 focus:ring-[#7c6ba8]/20 transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block font-medium text-sm text-[#c4b8e0] mb-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      autoComplete="current-password"
                      required={true}
                      minLength={6}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      id="password"
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 rounded-xl bg-[#0f0b16] text-[#e8e3f5] border border-[#2d2740] placeholder-[#5a4f73] outline-none focus:border-[#7c6ba8] focus:ring-2 focus:ring-[#7c6ba8]/20 transition"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <p className="text-red-400 text-sm text-center">
                        Wrong username or password!
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#7c6ba8] to-[#6a5a96] hover:from-[#8b7fb8] hover:to-[#7968a5] text-white font-semibold shadow-lg shadow-purple-900/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing In...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#2d2740]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[#1a1625] text-[#6b5f88]">
                        New to TaskFlow?
                      </span>
                    </div>
                  </div>

                  <Link to="/signup">
                    <button
                      type="button"
                      className="w-full py-3 rounded-xl bg-[#1a1625]/50 border border-[#2d2740] hover:bg-[#201a2e] hover:border-[#3d3450] text-[#c4b8e0] font-medium transition-all duration-200"
                    >
                      Create an Account
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
