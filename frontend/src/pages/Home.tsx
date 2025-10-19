import { useContext, useState } from "react";
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
import { FileText, CheckSquare } from "lucide-react";

const Home = () => {
  const [viewMode, setViewMode] = useState<"pages" | "todos">("pages");
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
      <div className="flex-1 flex flex-col h-screen">
        {/* Fixed Header with View Toggle */}
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
              {viewMode === "pages"
                ? "Manage your pages"
                : "Manage your tasks efficiently"}
            </p>
          </div>
          <div className="flex gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-[#1a1625] border border-[#2d2740] rounded-lg p-1">
              <button
                onClick={() => setViewMode("pages")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition ${
                  viewMode === "pages"
                    ? "bg-blue-600 text-white"
                    : "text-[#c4b8e0] hover:bg-[#201a2e]"
                }`}
              >
                <FileText size={16} />
                Pages
              </button>
              <button
                onClick={() => setViewMode("todos")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition ${
                  viewMode === "todos"
                    ? "bg-blue-600 text-white"
                    : "text-[#c4b8e0] hover:bg-[#201a2e]"
                }`}
              >
                <CheckSquare size={16} />
                Todos
              </button>
            </div>

            <button
              className="px-4 py-2 rounded-lg bg-[#1a1625] border border-[#2d2740] hover:bg-[#201a2e] text-[#c4b8e0] transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDeleteClick}
              disabled={!folderData || folderData.length <= 1}
            >
              Delete Folder
            </button>
          </div>
        </motion.div>

        {/* Content based on view mode */}
        {viewMode === "pages" ? (
          <PageList />
        ) : (
          <>
            {/* Scrollable TodoList Container */}
            <div className="flex-1 overflow-y-auto px-8 py-4">
              <div className="max-w-4xl mx-auto">
                <TodoList />
              </div>
            </div>

            {/* Fixed Input at Bottom */}
            <div className="flex-shrink-0 px-8 pb-8 pt-4 border-t border-[#1f1a2e]">
              <div className="max-w-4xl mx-auto">
                <FloatingInput />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
