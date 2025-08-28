import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Page from "./pages/Page";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AuthContextProvider from "./context/AuthContextProvider";
import AlertContextProvider from "./context/AlertContextProvider";
import Alert from "./components/Alert";
import Protected from "./components/Protected";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <AuthContextProvider>
      <AlertContextProvider>
        <Alert />
        <Routes>
          <Route
            path="/"
            element={
              <Protected>
                <Home />
              </Protected>
            }
          />
          <Route path="/page" element={<Page />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/temp" element={<Sidebar />} />
        </Routes>
      </AlertContextProvider>
    </AuthContextProvider>
  );
}

export default App;
