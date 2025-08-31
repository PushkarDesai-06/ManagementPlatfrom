import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgAddR } from "react-icons/cg";
import { createPortal } from "react-dom";

const Class = ({
  title = "title",
  description = "description",
  index = 0,
  openIdx = index,
  setOpenIdx,
  activeFolder,
  setActiveFolder,
}: {
  title?: string;
  description?: string;
  index: number;
  openIdx: number;
  activeFolder: number;
  setOpenIdx: (idx: number) => void;
  setActiveFolder: (idx: number) => void;
}) => {
  const [showDescription, setShowDescription] = useState<boolean>(false);

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: -30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          delay: (index * 1) / 10,
          duration: 0.2,
        }}
        className={`rounded-md flex p-2 bg-neutral-200 w-full relative hover:bg-neutral-300 transition items-center ${
          activeFolder === index && "bg-neutral-300"
        }`}
        onClick={(e) => {
          setActiveFolder(index);
        }}
      >
        <div className="flex-1">{title}</div>
        <button
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (openIdx === index) setOpenIdx(-1);
            else setOpenIdx(index);
          }}
        >
          <CgAddR />
        </button>
        <AnimatePresence>
          {openIdx === index && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }}
              className="p-4 top-0 absolute right-0 backdrop-blur-2xl  rounded-md px-2 py-1 border border-neutral-400/30 text-sm z-50"
            >
              {description}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Class;
