import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Page from "./pages/Page";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AuthContextProvider from "./context/AuthContextProvider";

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page" element={<Page />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
