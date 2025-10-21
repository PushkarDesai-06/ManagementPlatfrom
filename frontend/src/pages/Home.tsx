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
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";

const Home = () => {
  const { data: folderData } = useGetFoldersQuery();
  const { activeFolderId, changeActiveFolder } = useContext(FolderContext);
  const { mutate: DeleteMutation } = useDeleteFolderMutation();

  // Sidebar collapse states
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

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
    <div className="flex bg-[#0a070f] h-screen overflow-hidden relative">
      {/* Left Sidebar with Width Animation */}
      <motion.div
        initial={false}
        animate={{
          width: isLeftSidebarOpen ? 320 : 0,
          opacity: isLeftSidebarOpen ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          opacity: { duration: 0.15 },
        }}
        className="border-r border-[#1f1a2e] bg-[#0f0d14] flex-shrink-0 relative overflow-hidden"
      >
        <div className="w-80 h-full">
          <Sidebar />
        </div>
      </motion.div>

      {/* Main Content Area - Pages */}
      <div className="flex-1 flex flex-col h-screen relative min-w-0">
        {/* Header with Toggle Buttons */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          transition={{ delay: 0.3 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center p-8 pb-4 border-b border-[#1f1a2e] flex-shrink-0"
        >
          <div className="flex items-center gap-4">
            {/* Left Sidebar Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
              className="p-2 rounded-lg bg-[#1a1625] border border-[#2d2740] hover:bg-[#201a2e] text-[#c4b8e0] transition-all duration-200 shadow-lg hover:shadow-purple-900/20"
              aria-label={isLeftSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              {isLeftSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </motion.button>

            <div>
              <h1 className="text-2xl font-semibold text-[#e8e3f5]">
                {activeFolderName}
              </h1>
              <p className="text-sm text-[#6b5f88] mt-1">
                Manage your pages and tasks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDeleteClick}
              disabled={!folderData || folderData.length <= 1}
            >
              Delete Folder
            </button>

            {/* Right Sidebar Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className="p-2 rounded-lg bg-[#1a1625] border border-[#2d2740] hover:bg-[#201a2e] text-[#c4b8e0] transition-all duration-200 shadow-lg hover:shadow-purple-900/20"
              aria-label={isRightSidebarOpen ? "Hide tasks" : "Show tasks"}
            >
              {isRightSidebarOpen ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Pages Content */}
        <PageList />
      </div>

      {/* Right Sidebar - Todos with Width Animation */}
      <motion.div
        initial={false}
        animate={{
          width: isRightSidebarOpen ? 384 : 0,
          opacity: isRightSidebarOpen ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          opacity: { duration: 0.15 },
        }}
        className="border-l border-[#1f1a2e] bg-[#0f0d14] flex-shrink-0 overflow-hidden"
      >
        <div className="w-96 h-full flex flex-col">
          {/* Todos Header */}
          <div className="flex-shrink-0 p-6 pb-4 border-b border-[#1f1a2e]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-[#e8e3f5]">
                Quick Tasks
              </h2>
            </div>
            <p className="text-xs text-[#6b5f88]">
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
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
