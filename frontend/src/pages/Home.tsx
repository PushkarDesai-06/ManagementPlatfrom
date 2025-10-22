import { useContext, useState, useEffect } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import AddFolderPopup from "../components/AddFolderPopup";

const Home = () => {
  const { data: folderData } = useGetFoldersQuery();
  const { activeFolderId, changeActiveFolder } = useContext(FolderContext);
  const { mutate: DeleteMutation } = useDeleteFolderMutation();

  // Sidebar collapse states
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddFolderPopup, setShowAddFolderPopup] = useState(false);

  // Right sidebar resize state
  const MIN_RIGHT_SIDEBAR_WIDTH = 384; // 96 * 4 (w-96)
  const [rightSidebarWidth, setRightSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("rightSidebarWidth");
    return saved ? parseInt(saved) : MIN_RIGHT_SIDEBAR_WIDTH;
  });
  const [isResizing, setIsResizing] = useState(false);

  // Detect mobile/tablet screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);

      // Auto-collapse sidebars on mobile
      if (mobile) {
        setIsLeftSidebarOpen(false);
        setIsRightSidebarOpen(false);
      } else {
        // Auto-open on desktop
        setIsLeftSidebarOpen(true);
        setIsRightSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedLeftState = localStorage.getItem("isLeftSidebarOpen");
    const savedRightState = localStorage.getItem("isRightSidebarOpen");

    if (!isMobile) {
      if (savedLeftState !== null) {
        setIsLeftSidebarOpen(savedLeftState === "true");
      }
      if (savedRightState !== null) {
        setIsRightSidebarOpen(savedRightState === "true");
      }
    }
  }, [isMobile]);

  // Save collapsed state to localStorage
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("isLeftSidebarOpen", String(isLeftSidebarOpen));
      localStorage.setItem("isRightSidebarOpen", String(isRightSidebarOpen));
    }
  }, [isLeftSidebarOpen, isRightSidebarOpen, isMobile]);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= MIN_RIGHT_SIDEBAR_WIDTH && newWidth <= 800) {
        setRightSidebarWidth(newWidth);
        localStorage.setItem("rightSidebarWidth", String(newWidth));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleDeleteClick = () => {
    if (!folderData || folderData.length === 0) return;

    if (confirm("Are you sure you want to delete this folder?") !== true) {
      return;
    }

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
    <>
      {showAddFolderPopup &&
        createPortal(
          <AddFolderPopup onClose={() => setShowAddFolderPopup(false)} />,
          document.getElementById("popup-root")!
        )}
      <div className="flex bg-[#0a070f] h-screen overflow-hidden relative">
        {/* Mobile Overlay for Sidebars */}
        {isMobile && (isLeftSidebarOpen || isRightSidebarOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsLeftSidebarOpen(false);
              setIsRightSidebarOpen(false);
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}

        {/* Left Sidebar with Width Animation */}
        <motion.div
          initial={false}
          animate={{
            width: isLeftSidebarOpen ? (isMobile ? "100%" : 320) : 0,
            opacity: isLeftSidebarOpen ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            opacity: { duration: 0.15 },
          }}
          className={`
          border-r border-[#1f1a2e] bg-[#0f0d14] shrink-0 relative overflow-hidden
          ${
            isMobile && isLeftSidebarOpen
              ? "fixed inset-y-0 left-0 z-40 max-w-sm"
              : ""
          }
        `}
        >
          <div className={`${isMobile ? "w-full" : "w-80"} h-full relative`}>
            {/* Close button for mobile */}
            {isMobile && isLeftSidebarOpen && (
              <button
                onClick={() => setIsLeftSidebarOpen(false)}
                className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-[#1a1625] border border-[#2d2740] hover:bg-[#201a2e] text-[#c4b8e0]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <Sidebar onAddFolderClick={() => setShowAddFolderPopup(true)} />
          </div>
        </motion.div>

        {/* Main Content Area - Pages */}
        <div className="flex-1 flex flex-col h-screen relative min-w-0">
          {/* Header with Toggle Buttons */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.3 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center p-4 sm:p-6 lg:p-8 pb-4 border-b border-[#1f1a2e] shrink-0"
          >
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {/* Left Sidebar Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                className="p-2 rounded-lg bg-[#1a1625] border border-[#2d2740] hover:bg-[#201a2e] text-[#c4b8e0] transition-all duration-200 shadow-lg hover:shadow-purple-900/20 shrink-0"
                aria-label={isLeftSidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {isLeftSidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4" />
                ) : isMobile ? (
                  <Menu className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </motion.button>

              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#e8e3f5] truncate">
                  {activeFolderName}
                </h1>
                <p className="text-xs sm:text-sm text-[#6b5f88] mt-1 hidden sm:block">
                  Manage your pages and tasks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                className="px-3 py-2 sm:px-4 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-all duration-200 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
                onClick={handleDeleteClick}
                disabled={!folderData || folderData.length <= 1}
              >
                Delete Folder
              </button>

              {/* Mobile: Delete Icon */}
              <button
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed sm:hidden"
                onClick={handleDeleteClick}
                disabled={!folderData || folderData.length <= 1}
              >
                <X className="w-4 h-4" />
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
                ) : isMobile ? (
                  <Menu className="w-4 h-4" />
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
            width: isRightSidebarOpen
              ? isMobile
                ? "100%"
                : rightSidebarWidth
              : 0,
            opacity: isRightSidebarOpen ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            opacity: { duration: 0.15 },
          }}
          style={{
            width:
              !isMobile && isRightSidebarOpen ? rightSidebarWidth : undefined,
          }}
          className={`
          border-l border-[#1f1a2e] bg-[#0f0d14] shrink-0 overflow-hidden relative
          ${
            isMobile && isRightSidebarOpen
              ? "fixed inset-y-0 right-0 z-40 max-w-sm"
              : ""
          }
        `}
        >
          {/* Resize Handle */}
          {!isMobile && isRightSidebarOpen && (
            <div
              onMouseDown={handleResizeStart}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-[#7c6ba8]/50 active:bg-[#7c6ba8] transition-colors z-50 group"
            >
              <div className="absolute left-0 top-0 bottom-0 w-3 -translate-x-1" />
            </div>
          )}

          <div
            style={{
              width:
                !isMobile && isRightSidebarOpen ? rightSidebarWidth : undefined,
            }}
            className={`${
              isMobile ? "w-full" : ""
            } h-full flex flex-col relative`}
          >
            {/* Todos Header */}
            <div className="shrink-0 p-4 sm:p-6 pb-4 border-b border-[#1f1a2e]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg sm:text-xl font-semibold text-[#e8e3f5]">
                  Quick Tasks
                </h2>
                {/* Close button for mobile */}
                {isMobile && isRightSidebarOpen && (
                  <button
                    onClick={() => setIsRightSidebarOpen(false)}
                    className="p-2 rounded-lg bg-[#1a1625] border border-[#2d2740] hover:bg-[#201a2e] text-[#c4b8e0]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-[#6b5f88]">
                Manage your todos for this folder
              </p>
            </div>

            {/* Scrollable TodoList */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              <TodoList />
            </div>

            {/* Fixed Input at Bottom */}
            <div className="shrink-0 px-4 sm:px-6 pb-4 sm:pb-6 pt-4 border-t border-[#1f1a2e]">
              <FloatingInput />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Home;
