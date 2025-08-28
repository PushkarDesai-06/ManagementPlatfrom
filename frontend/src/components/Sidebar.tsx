import React, { useEffect, useState } from "react";
import Class from "./Class";
import { FaNoteSticky } from "react-icons/fa6";
import { motion } from "framer-motion";

const Sidebar = () => {
  const arr = ["title 1", "title 2", "title 3", "title 4", "title 5"];
  const [openIdx, setOpenIdx] = useState<number>(-1);
  const [activeFolder, setActiveFolder] = useState<number>(0);
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
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0  , duration : 0.5}}
      className="h-screen max-w-xs p-4 flex flex-col shadow-xl bg-neutral-100 border-r border-r-neutral-300"
    >
      <div className="px-4 mb-8">
        {" "}
        <FaNoteSticky className="text-2xl" />{" "}
      </div>
      <label
        htmlFor=""
        className="text-sm font-ubuntu text-neutral-700/90 pl-4 mb-2"
      >
        Folders
      </label>
      <div className="flex flex-col gap-4 overflow-y-auto items-center">
        <div className="w-3xs p-4 flex flex-col gap-2 overflow-y-auto scrollbar-thin">
          {arr.map((elem, idx) => (
            <Class
              key={idx}
              title={elem}
              index={idx}
              openIdx={openIdx}
              setOpenIdx={setOpenIdx}
              activeFolder={activeFolder}
              setActiveFolder={setActiveFolder}
            />
          ))}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
