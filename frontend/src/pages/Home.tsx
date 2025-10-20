import { useContext } from "react";
import { FloatingInput } from "../components/FloatingInput";
import Sidebar from "../components/Sidebar";
import TodoList from "../components/TodoList";
import PageList from "../components/PageList";
import { motion } from "framer-motion";
import {
  useDeleteFolderMutation,
  useGetFoldersQuery,
} from "../queries/folderqueries";
import { FolderContext } from "../context/folderContext";

const Home = () => {
  const { data: folderData } = useGetFoldersQuery();
  const { activeFolderId, changeActiveFolder } = useContext(FolderContext);
  const { mutate: DeleteMutation } = useDeleteFolderMutation();

  const handleDeleteClick = () => {
    if (!folderData || folderData.length === 0) return;

    const activeFolderIndex = folderData.findIndex(
      (folder: { id: string; name: string }) => folder.id === activeFolderId
    );

    console.log("active folder index:", activeFolderIndex);
    console.log("folders length:", folderData.length);

    // If this is the last folder, don't delete
    if (folderData.length === 1) {
      console.log("Cannot delete the last folder");
      return;
    }

    // If deleting the last item in the list, go to previous
    // Otherwise, stay at the same index (which will be the next item after deletion)
    let nextFolderId: string;

    if (activeFolderIndex === folderData.length - 1) {
      // Deleting last item, go to previous
      nextFolderId = folderData[activeFolderIndex - 1].id;
    } else {
      // Not last item, next item will shift into this position
      nextFolderId = folderData[activeFolderIndex + 1].id;
    }

    const prevFolderId = activeFolderId;

    console.log("nextFolderId:", nextFolderId);
    console.log("prevFolderId:", prevFolderId);

    // Change to the next folder BEFORE deleting
    changeActiveFolder(nextFolderId);

    // Small delay to ensure state update, then delete
    setTimeout(() => {
      DeleteMutation(prevFolderId);
    }, 50);
  };

  const activeFolderName =
    (folderData &&
      activeFolderId &&
      folderData.find(
        (elem: { id: string; name: string }) => elem.id == activeFolderId
      )?.name) ||
    "Loading...";

  return (
    <div className="flex bg-[#0a070f] h-screen overflow-hidden">
      <div className="">
        <Sidebar />
      </div>

      {/* Main Content Area - Pages */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          transition={{ delay: 0.3 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center p-8 pb-4 border-b border-[#1f1a2e] flex-shrink-0"
        >
          <div>
            <h1 className="text-2xl font-semibold text-[#e8e3f5]">
              {activeFolderName}
            </h1>
            <p className="text-sm text-[#6b5f88] mt-1">
              Manage your pages and tasks
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-lg bg-[#1a1625] border border-[#2d2740] hover:bg-[#201a2e] text-[#c4b8e0] transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDeleteClick}
            disabled={!folderData || folderData.length <= 1}
          >
            Delete Folder
          </button>
        </motion.div>

        {/* Pages Content */}
        <PageList />
      </div>

      {/* Right Sidebar - Todos */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        transition={{ delay: 0.4 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-96 border-l border-[#1f1a2e] bg-[#0f0d14] flex flex-col h-screen"
      >
        {/* Todos Header */}
        <div className="flex-shrink-0 p-6 pb-4 border-b border-[#1f1a2e]">
          <h2 className="text-xl font-semibold text-[#e8e3f5]">Quick Tasks</h2>
          <p className="text-xs text-[#6b5f88] mt-1">
            Manage your todos for this folder
          </p>
        </div>

        {/* Scrollable TodoList */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <TodoList />
        </div>

        {/* Fixed Input at Bottom */}
        <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t border-[#1f1a2e]">
          <FloatingInput />
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
