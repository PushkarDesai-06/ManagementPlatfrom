import { useContext, useEffect, useState } from "react";
import axios from "../lib/axios";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../context/alertContext";
import { isAxiosError } from "axios";
import { Loader } from "lucide-react";

const Protected = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  const { openAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      // Check if token exists in localStorage
      const token = localStorage.getItem("JwtToken");

      if (!token) {
        auth?.updateAuthenticated(false);
        auth?.updateUser("", "");
        setLoading(false);
        navigate("/signin");
        return;
      }

      try {
        const req = await axios.get(`/auth/get-info`);
        if (req.data.authenticated && req.data.name) {
          auth?.updateAuthenticated(true);
          auth?.updateUser(req.data.name, req.data.email);
          setLoading(false);
          return;
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          if (error.response && error.response.status === 401) {
            auth?.updateAuthenticated(false);
            auth?.updateUser("", "");
            localStorage.removeItem("JwtToken");
            setLoading(false);
            openAlert("Session Expired", "Please sign in again");
            navigate("/signin");
          } else {
            auth?.updateAuthenticated(false);
            auth?.updateUser("", "");
            localStorage.removeItem("JwtToken");
            openAlert(
              "Authentication Error",
              error.response?.data?.message || "Failed to verify authentication"
            );
            setLoading(false);
            navigate("/signin");
          }
          console.log(error);
        }
      }
    };

    if (auth?.authenticated) {
      setLoading(false);
    } else {
      verifyToken();
    }
  }, []);

  return loading ? (
    <div className="flex justify-center items-center w-screen h-screen bg-[#0a070f]">
      <Loader className="animate-spin text-[#7c6ba8]" size={48} />
    </div>
  ) : (
    <>{children}</>
  );
};

export default Protected;
