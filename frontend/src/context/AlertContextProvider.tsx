import React, { useRef, useState } from "react";
import { AlertContext } from "./alertContext";

const AlertContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [alert, setAlert] = useState<{ title: string; message: string }>({
    title: "",
    message: "",
  });
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const timeRef = useRef<number | null>(null);

  const openAlert = (title: string, message: string) => {
    if (timeRef.current === null) {
      setAlert({ title, message });
      setShowAlert(true);
      timeRef.current = setTimeout(() => {
        // timeRef.current = null;
        closeAlert();
      }, 5000);
    }
  };

  const closeAlert = () => {
    timeRef.current && clearInterval(timeRef.current);
    timeRef.current = null;
    setShowAlert(false);
    // setAlert({ message: "", title: "" });
  };

  return (
    <AlertContext.Provider
      value={{ alert, openAlert, closeAlert, timeRef, showAlert }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContextProvider;
