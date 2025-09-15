import React from "react";
import AuthContextProvider from "./AuthContextProvider";
import AlertContextProvider from "./AlertContextProvider";
import FolderContextProvider from "./FolderContextProvider";

const CombinedContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <FolderContextProvider>
      <AuthContextProvider>
        <AlertContextProvider>{children}</AlertContextProvider>
      </AuthContextProvider>
    </FolderContextProvider>
  );
};

export default CombinedContextProvider;
