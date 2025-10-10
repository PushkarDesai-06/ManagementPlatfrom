import React, { useContext, useEffect, useState } from "react";
import Folder from "./Folder";
import { FaNoteSticky } from "react-icons/fa6";
import { motion } from "framer-motion";
import { AuthContext } from "../context/authcontext";
import { FolderContext } from "../context/folderContext";
import { LoaderIcon } from "lucide-react";
import { IoAdd } from "react-icons/io5";
import {
  useAddFolderMutation,
  useGetFoldersQuery,
} from "../queries/folderqueries";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [openIdx, setOpenIdx] = useState<number>(-1);
  const [activeFolder, setActiveFolder] = useState<number>(0);
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [newFolderName, setNewFolderName] = useState("NewFolder");
  const auth = useContext(AuthContext);
  const { changeActiveFolder, activeFolderId } = useContext(FolderContext);
  const navigate = useNavigate();
  const { data, isPending } = useGetFoldersQuery();
  const { mutate } = useAddFolderMutation();

  useEffect(() => {
    if (data) {
      setFolders(data);

      // Find the index of the active folder
      const activeIndex = data.findIndex(
        (folder: { id: string; name: string }) => folder.id === activeFolderId
      );

      if (activeIndex !== -1) {
        setActiveFolder(activeIndex);
      } else if (data.length > 0) {
        // If active folder not found but we have folders, set first one
        setActiveFolder(0);
        changeActiveFolder(data[0].id);
      }
    }
  }, [data, activeFolderId]);

  const handleAddFolder = () => {
    mutate(newFolderName);
  };

  const handleLogout = () => {
    auth?.logout();
    navigate("/signin");
  };

  if (isPending)
    return (
      <div className="min-h-screen w-80 bg-[#0f0b16] border-r border-[#1f1a2e] flex items-center justify-center">
        <LoaderIcon className="animate-spin text-[#7c6ba8]" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen w-80 bg-[#0f0b16] border-r border-[#1f1a2e] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#1f1a2e]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#7c6ba8]">
            <FaNoteSticky className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#e8e3f5]">TaskFlow</h1>
            <p className="text-xs text-[#6b5f88]">Organize your work</p>
          </div>
        </div>

        {/* Add Folder */}
        <button
          onClick={handleAddFolder}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#7c6ba8] hover:bg-[#8b7fb8] text-white transition font-medium text-sm"
        >
          <IoAdd size={20} />
          New Folder
        </button>
      </div>

      {/* Folders List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {folders.map(
            (folder: { id: string; name: string }, index: number) => (
              <Folder
                key={folder.id}
                id={folder.id}
                title={folder.name}
                index={index}
                openIdx={openIdx}
                activeFolder={activeFolder}
                setOpenIdx={setOpenIdx}
                setActiveFolder={setActiveFolder}
              />
            )
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#1f1a2e]">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 rounded-lg bg-[#1a1625] hover:bg-[#201a2e] text-[#c4b8e0] transition text-sm font-medium border border-[#2d2740]"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
