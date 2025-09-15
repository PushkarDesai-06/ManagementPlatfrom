import React from "react";

export type FolderContextType = {
  activeFolderId: string;
  changeActiveFolder: (activeFolder: string) => void;
};

export const FolderContext = React.createContext<FolderContextType>({
  activeFolderId: "",
  changeActiveFolder: () => {},
});
