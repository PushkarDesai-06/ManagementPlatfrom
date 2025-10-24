import React, { useState } from "react";
import { AuthContext } from "./authcontext";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const { removeLocalStorage } = useLocalStorage();

  const updateAuthenticated = (status: boolean) => {
    setAuthenticated(status);
  };

  const logout = () => {
    updateAuthenticated(false);
    updateUser("", "");
    removeLocalStorage("JwtToken");
  };

  const updateUser = (name: string | null, email: string | null) => {
    setName(name);
    setEmail(email);
  };
  return (
    <AuthContext.Provider
      value={{
        name,
        authenticated,
        email,
        updateUser,
        updateAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
