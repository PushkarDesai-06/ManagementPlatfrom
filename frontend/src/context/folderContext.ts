import React from "react";

export type FolderContextType = {
  activeFolderId: string;
  changeActiveFolder: (activeFolder: string) => void;
  folders: { id: string; name: string }[];
  changeFolders: (folders: { id: string; name: string }[]) => void;
};

export const FolderContext = React.createContext<FolderContextType>({
  activeFolderId: "",
  changeActiveFolder: () => {},
  folders: [],
  changeFolders: () => {},
});
