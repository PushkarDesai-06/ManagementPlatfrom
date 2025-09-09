import { useContext, useEffect, useState } from "react";
import Folder from "./Folder";
import { FaNoteSticky } from "react-icons/fa6";
import { motion } from "framer-motion";
import { AuthContext } from "../context/authcontext";
import { LoaderIcon } from "lucide-react";
import { IoAdd } from "react-icons/io5";
import {
  useAddFolderMutation,
  useGetFoldersQuery,
} from "../queries/folderqueries";

const Sidebar = () => {
  const arr = ["title 1", "title 2", "title 3", "title 4", "title 5"];
  const [openIdx, setOpenIdx] = useState<number>(-1);
  const [activeFolder, setActiveFolder] = useState<number>(0);
  const [folders, setFolders] = useState<{ id: String; name: string }[]>([]);
  const [newFolderName, setNewFolderName] = useState("NewFolder");
  const auth = useContext(AuthContext);

  const { data, isPending } = useGetFoldersQuery();
  const mutate = useAddFolderMutation();

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
        <button
          className="cursor-pointer text-md"
          onClick={() => mutate(newFolderName)}
        >
          <IoAdd />
        </button>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto items-center">
        <div className="w-3xs p-4 flex flex-col gap-2 overflow-y-auto scrollbar-thin">
          {isPending ? (
            <LoaderIcon />
          ) : (
            <>
              {data.length > 0 ? (
                data.map((elem: { id: String; name: String }, idx: number) => (
                  <Folder
                    id={elem.id}
                    key={idx}
                    title={elem.name}
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
