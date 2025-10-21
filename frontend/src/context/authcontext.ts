import { createContext } from "react";

interface AuthContextInterface {
  name?: string | null;
  authenticated: boolean;
  email?: string | null;
  updateUser: (name: string | null, email: string | null) => void;
  updateAuthenticated: (status: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface>({
  name: null,
  authenticated: false,
  email: null,
  updateUser: () => {},
  updateAuthenticated: () => {},
  logout: () => {},
});
