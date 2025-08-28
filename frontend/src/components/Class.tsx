import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Class = ({
  title = "title",
  description = "description",
  index = 0,
  openIdx = index,
  setOpenIdx,
}: {
  title?: string;
  description?: string;
  index: number;
  openIdx: number;
  setOpenIdx: (idx: number) => void;
}) => {
  const [showDescription, setShowDescription] = useState<boolean>(false);

  return (
    <>
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          delay: (index * 1) / 10,
          duration: 0.2,
        }}
        className="rounded-md flex items-start p-2 bg-neutral-200 w-full relative hover:bg-neutral-300 transition"
      >
        <div className="flex-1">{title}</div>
        <button
          className="cursor-pointer"
          onClick={() => {
            if (openIdx === index) {
              setOpenIdx(-1);
            }else{
              setOpenIdx(index)
            }
          }}
        >
          D
        </button>
        <AnimatePresence>
          {openIdx === index && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }}
              className="p-4 absolute  backdrop-blur-2xl rounded-md px-4 -bottom-8 z-50 border border-neutral-400/30"
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
