import { MdEdit, MdEditOff } from "react-icons/md";
import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgAddR } from "react-icons/cg";
import { createPortal } from "react-dom";
import { useEditFolderNameMutation } from "../queries/folderqueries";
import { FolderContext } from "../context/folderContext";

const Folder = ({
  id,
  title = "title",
  description = "description",
  index = 0,
  openIdx = index,
  setOpenIdx,
  activeFolder,
  setActiveFolder,
}: {
  id: string;
  title?: string;
  description?: string;
  index: number;
  openIdx: number;
  activeFolder: number;
  setOpenIdx: (idx: number) => void;
  setActiveFolder: (idx: number) => void;
}) => {
  const updateFolderName = useEditFolderNameMutation();
  const [folderTitle, setFolderTitle] = useState<string>(title);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const { changeActiveFolder } = useContext(FolderContext);
  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: -30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          delay: (index * 1) / 10,
          duration: 0.2,
        }}
        className={`rounded-md flex p-2 bg-neutral-300 w-full relative hover:bg-neutral-400 transition items-center ${
          activeFolder === index && "bg-neutral-400"
        }`}
        onClick={(e) => {
          setActiveFolder(index);
          changeActiveFolder(id);
        }}
      >
        <form
          onSubmit={(e) => {
            setIsEditable(false);
            e.preventDefault();
            updateFolderName({ id: id, newName: folderTitle });
          }}
          className=""
        >
          <input
            className="w-full"
            value={folderTitle}
            disabled={!isEditable}
            maxLength={25}
            minLength={1}
            required={true}
            onChange={(e) => setFolderTitle(e.target.value)}
          />
        </form>
        <button
          className="cursor-pointer"
          onClick={(e) => {
            setIsEditable((prev) => !prev);
          }}
        >
          {isEditable ? <MdEditOff /> : <MdEdit />}
        </button>
      </motion.div>
    </>
  );
};

export default Folder;
