import React, { useState } from "react";
import { FolderContext } from "./folderContext";

const FolderContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeFolderId, setActiveFolderId] = useState<string>("");
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);

  const changeActiveFolder = (activeFolder: string) => {
    setActiveFolderId(activeFolder);
  };

  const changeFolders = (folders: { id: string; name: string }[]) => {
    setFolders(folders);
  };

  return (
    <FolderContext.Provider
      value={{ activeFolderId, changeActiveFolder, folders, changeFolders }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export default FolderContextProvider;
