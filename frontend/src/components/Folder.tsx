import { MdEdit, MdEditOff } from "react-icons/md";
import { useContext, useState } from "react";
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
          className=""
        >
          <input
            onClick={() => console.log("clicked!!")}
            className="w-full outline-none"
            value={folderTitle}
            readOnly={!isEditable}
            maxLength={25}
            minLength={1}
            required={true}
            onChange={(e) => setFolderTitle(e.target.value)}
          />
        </form>
        <button
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
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
