import React, { useContext, useEffect, useState } from "react";
import Class from "./Class";
import axios from "../lib/axios";
import { FaNoteSticky } from "react-icons/fa6";
import { motion } from "framer-motion";
import useLocalStorage from "../hooks/useLocalStorage";
import { AuthContext } from "../context/authcontext";
import { CgListTree } from "react-icons/cg";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { IoAdd } from "react-icons/io5";

const Sidebar = () => {
  const arr = ["title 1", "title 2", "title 3", "title 4", "title 5"];
  const [openIdx, setOpenIdx] = useState<number>(-1);
  const [activeFolder, setActiveFolder] = useState<number>(0);
  const { getLocalStorage } = useLocalStorage();
  const [folders, setFolders] = useState<string[]>([]);
  const auth = useContext(AuthContext);

  const getFolders = async () => {
    try {
      const req = await axios.get("/todo/folders");
      console.log(req.data.folders);
      setFolders(req.data.folders);
      return req.data.folders;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const addFolder = () => {};

  const { data, isPending } = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });

  useEffect(() => {
    const handleClick = () => {
      setOpenIdx(-1);
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0, duration: 0.5 }}
      className="h-screen max-w-xs p-4 flex flex-col shadow-xl bg-neutral-100 border-r border-r-neutral-300 origin-left"
    >
      <div className="px-4 mb-8">
        {" "}
        <FaNoteSticky className="text-2xl" />{" "}
      </div>
      <div className="text-sm font-ubuntu text-neutral-700/90 pl-4 mb-2 flex justify-between">
        <div>Folders</div>
        <button className="cursor-pointer text-md" onClick={addFolder}>
          <IoAdd />
        </button>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto items-center">
        <div className="w-3xs p-4 flex flex-col gap-2 overflow-y-auto scrollbar-thin">
          {isPending ? (
            <LoaderIcon />
          ) : (
            <>
              {folders.length > 0 ? (
                folders.map((elem, idx) => (
                  <Class
                    key={idx}
                    title={elem}
                    index={idx}
                    openIdx={openIdx}
                    setOpenIdx={setOpenIdx}
                    activeFolder={activeFolder}
                    setActiveFolder={setActiveFolder}
                  />
                ))
              ) : (
                <div className="text-sm text-neutral-600">
                  No Folders Found. Create One!
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
