import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Page from "./pages/Page";
import SignIn from "./pages/signIn";
import SignUp from "./pages/SignUp";
import Alert from "./components/Alert";
import Protected from "./components/Protected";
import { BrowserRouter } from "react-router-dom";
import Account from "./pages/Account";
import Todo from "./components/TodoList";
import CombinedContextProvider from "./context/CombinedContextProvider";

function App() {
  return (
    <CombinedContextProvider>
      <BrowserRouter>
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
          <Route
            path="/account"
            element={
              <Protected>
                <Account />
              </Protected>
            }
          />

          <Route path="/temp" element={<Todo />} />
        </Routes>
      </BrowserRouter>
    </CombinedContextProvider>
  );
}

export default App;
