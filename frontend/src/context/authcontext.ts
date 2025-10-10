import React from "react";

interface AuthContextInterface {
  name?: string | null;
  authenticated: boolean;
  email?: string | null;
  updateUser: (name: string | null, email: string | null) => void;
  updateAuthenticated: (status: boolean) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextInterface | null>(
  null
);
