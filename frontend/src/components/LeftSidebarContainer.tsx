import { motion } from "framer-motion";
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
          ${isMobile && isOpen ? "fixed inset-y-0 left-0 z-40 w-80" : ""}
        `}
    >
      <div className={`${isMobile ? "w-full" : "w-80"} h-full relative`}>
        <Sidebar
          onAddFolderClick={onAddFolderClick}
          onClose={isMobile ? onClose : undefined}
          isMobile={isMobile}
        />
      </div>
    </motion.div>
  );
};

export default LeftSidebarContainer;
