import React, { useContext, useEffect, useState } from "react";
import Folder from "./Folder";
import { FaNoteSticky } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderIcon } from "lucide-react";
import { IoAdd } from "react-icons/io5";
import {
  useAddFolderMutation,
  useGetFoldersQuery,
} from "../queries/folderqueries";
import { FolderContext } from "../context/folderContext";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const Sidebar = () => {
  const [openIdx, setOpenIdx] = useState<number>(-1);
  const [activeFolder, setActiveFolder] = useState<number>(0);
  const [newFolderName] = useState("NewFolder");
  const { changeActiveFolder } = useContext(FolderContext); // Add this
  const { data: folderData, isPending } = useGetFoldersQuery();
  const { mutate } = useAddFolderMutation();

  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (folderData && folderData.length > 0 && activeFolder >= 0) {
      changeActiveFolder(folderData[activeFolder]?.id || "");
    }
  }, [activeFolder, folderData, changeActiveFolder]);

  const handleLogout = async () => {
    auth?.updateAuthenticated(false);
    auth?.updateUser("", "");
    await axios.get("/auth/logout");
    navigate("/signin");
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0, duration: 0.5 }}
        exit={{ opacity: 0, x: -100 }}
        className="h-screen max-w-xs p-4 flex flex-col shadow-xl bg-neutral-100 border-r border-r-neutral-300 origin-left"
      >
        <div className="px-4 mb-8">
          {" "}
          <FaNoteSticky className="text-2xl" />{" "}
        </div>
        <div className="text-sm font-ubuntu text-neutral-700/90 pl-4 mb-2 flex justify-between">
          <div>Folders</div>
          <button
            className="cursor-pointer text-md"
            onClick={() => mutate(newFolderName)}
          >
            <IoAdd />
          </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto items-center">
          <div className="w-3xs p-4 flex flex-col gap-2 h-72 overflow-y-auto scrollbar-none bg-neutral-200 rounded-lg">
            {isPending ? (
              <LoaderIcon />
            ) : (
              <>
                {folderData.length > 0 ? (
                  folderData.map(
                    (elem: { id: string; name: string }, idx: number) => (
                      <Folder
                        id={elem.id}
                        key={elem.id}
                        title={elem.name}
                        index={idx}
                        openIdx={openIdx}
                        setOpenIdx={setOpenIdx}
                        activeFolder={activeFolder}
                        setActiveFolder={setActiveFolder}
                      />
                    )
                  )
                ) : (
                  <div className="text-sm text-neutral-600">
                    No Folders Found. Create One!
                  </div>
                )}
              </>
            )}
          </div>
          <button
            className="bottom-4 absolute border py-2 w-28 rounded-md bg-green-600 border-green-300 text-white cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;
