import { motion } from "framer-motion";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";

interface LeftSidebarContainerProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  onAddFolderClick: () => void;
}

const LeftSidebarContainer = ({
  isOpen,
  isMobile,
  onClose,
  onAddFolderClick,
}: LeftSidebarContainerProps) => {
  return (
    <motion.div
      initial={false}
      animate={{
        width: isOpen ? (isMobile ? "100%" : 320) : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.15 },
      }}
      className={`
          border-r border-[#1f1a2e] bg-[#0f0d14] shrink-0 relative overflow-hidden
          ${isMobile && isOpen ? "fixed inset-y-0 left-0 z-40 max-w-sm" : ""}
        `}
    >
      <div className={`${isMobile ? "w-full" : "w-80"} h-full relative`}>
        {/* Close button for mobile */}
        {isMobile && isOpen && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-[#1a1625] border border-[#2d2740] hover:bg-[#201a2e] text-[#c4b8e0]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <Sidebar onAddFolderClick={onAddFolderClick} />
      </div>
    </motion.div>
  );
};

export default LeftSidebarContainer;
