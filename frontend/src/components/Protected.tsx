import React, { useContext, useEffect, useState } from "react";
import axios from "../lib/axios";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../context/alertContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { isAxiosError } from "axios";
import { Loader } from "lucide-react";

const Protected = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  const { openAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { removeLocalStorage } = useLocalStorage();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const req = await axios.get(`/auth/get-info`);
        if (req.data.name) {
          auth?.updateAuthenticated(true);
          auth?.updateUser(req.data.name, req.data.email);
          // navigate("/");
          setLoading(false);
          return;
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          if (error.response && error.response.status === 401) {
            auth?.updateAuthenticated(false);
            auth?.updateUser("", "");
            setLoading(false);
            openAlert("Error!", error.response.data.message);
          } else {
            auth?.updateAuthenticated(false);
            auth?.updateUser("", "");
            // console.log(er);
          }
          openAlert(
            "Sign In Error!",
            error.response ? error.response.data.message : ""
          );
          removeLocalStorage("JwtToken");
          navigate("/signin");
          console.log(error);
        }
      }
    };
    if (auth?.authenticated) setLoading(false);
    try {
      verifyToken();
    } catch (error) {
      navigate("/signin");
    }
  }, []);

  return loading ? (
    <div className="flex justify-center items-center w-screen h-screen">
      <Loader className="animate-spin" />
    </div>
  ) : (
    <>{children}</>
  );
};

export default Protected;
