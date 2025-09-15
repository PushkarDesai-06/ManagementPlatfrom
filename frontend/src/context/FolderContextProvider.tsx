import React, { useState } from "react";
import { FolderContext } from "./folderContext";

const FolderContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeFolderId, setActiveFolderId] = useState<string>("");

  const changeActiveFolder = (activeFolder: string) => {
    setActiveFolderId(activeFolder);
  };

  return (
    <FolderContext.Provider value={{ activeFolderId, changeActiveFolder }}>
      {children}
    </FolderContext.Provider>
  );
};

export default FolderContextProvider;
