import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelRightClose,
  Menu,
  Trash2,
} from "lucide-react";

interface HomeHeaderProps {
  activeFolderName: string;
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  isMobile: boolean;
  folderData: { id: string; name: string }[] | undefined;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onDeleteClick: () => void;
}

const HomeHeader = ({
  activeFolderName,
  isLeftSidebarOpen,
  isRightSidebarOpen,
  isMobile,
  folderData,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onDeleteClick,
}: HomeHeaderProps) => {
  return (
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
          onClick={onToggleLeftSidebar}
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
        {/* Desktop: Delete Button with Text */}
        <button
          className="px-3 py-2 sm:px-4 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-all duration-200 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
          onClick={onDeleteClick}
          disabled={!folderData || folderData.length <= 1}
        >
          Delete Folder
        </button>

        {/* Mobile: Delete Icon */}
        <button
          className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed block sm:hidden"
          onClick={onDeleteClick}
          disabled={!folderData || folderData.length <= 1}
          aria-label="Delete Folder"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Right Sidebar Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleRightSidebar}
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
  );
};

export default HomeHeader;
