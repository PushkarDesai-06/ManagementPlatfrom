import { MdEdit, MdEditOff } from "react-icons/md";
import React, { useContext, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useEditFolderNameMutation } from "../queries/folderqueries";
import { FolderContext } from "../context/folderContext";

const Folder = ({
  id,
  title = "title",
  index = 0,
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
  const inputRef = useRef<null | HTMLInputElement>(null);
  return (
    <>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: (index * 1) / 10,
          duration: 0.2,
        }}
        className={`rounded-lg flex px-3 py-2 w-full relative hover:bg-[#1a1625] transition items-center cursor-pointer ${
          activeFolder === index
            ? "bg-[#1a1625] border-l-2 border-[#7c6ba8]"
            : "border-l-2 border-transparent"
        }`}
        onClickCapture={() => {
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
          className="flex-1"
        >
          <input
            ref={inputRef}
            className={`w-full outline-none bg-transparent text-sm ${
              activeFolder === index ? "text-[#c4b8e0]" : "text-[#8b7fb8]"
            }`}
            value={folderTitle}
            readOnly={!isEditable}
            maxLength={25}
            minLength={1}
            required={true}
            onChange={(e) => setFolderTitle(e.target.value)}
          />
        </form>
        <button
          className="cursor-pointer text-[#6b5f88] hover:text-[#8b7fb8] transition text-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditable((prev) => {
              if (!prev) {
                inputRef?.current?.focus();
              }
              return !prev;
            });
          }}
        >
          {isEditable ? <MdEditOff /> : <MdEdit />}
        </button>
      </motion.div>
    </>
  );
};

export default Folder;
