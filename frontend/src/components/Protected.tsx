import React, { useContext, useEffect, useState } from "react";
import axios from "../lib/axios";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router";
import { AlertContext } from "../context/alertContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { AxiosError, isAxiosError } from "axios";

const Protected = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  const { openAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { getLocalStorage, setLocalStorage, removeLocalStorage } =
    useLocalStorage();

  useEffect(() => {
    const verifyToken = async (JwtToken: string) => {
      try {
        const req = await axios.get(`/get-info`, {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
          },
        });
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
            auth?.updateUser(null, null);
            setLoading(false);
          } else {
            auth?.updateAuthenticated(false);
            auth?.updateUser("", "");
            // console.log(er);
            navigate("/signin");
          }

          console.log(error);
          removeLocalStorage("JwtToken");
        }
      }
    };
    if (auth?.authenticated) setLoading(false);
    else if (getLocalStorage("JwtToken"))
      verifyToken(getLocalStorage("JwtToken"));
    else {
      navigate("/signin");
    }
  }, []);

  return loading ? <div>loading...</div> : <>{children}</>;
};

export default Protected;
