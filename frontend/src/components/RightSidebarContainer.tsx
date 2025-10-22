import { motion } from "framer-motion";
import { X } from "lucide-react";
import TodoList from "./TodoList";
import { FloatingInput } from "./FloatingInput";

interface RightSidebarContainerProps {
  isOpen: boolean;
  isMobile: boolean;
  width: number;
  onClose: () => void;
  onResizeStart: () => void;
}

const RightSidebarContainer = ({
  isOpen,
  isMobile,
  width,
  onClose,
  onResizeStart,
}: RightSidebarContainerProps) => {
  return (
    <motion.div
      initial={false}
      animate={{
        width: isOpen ? (isMobile ? "100%" : width) : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.15 },
      }}
      style={{
        width: !isMobile && isOpen ? width : undefined,
      }}
      className={`
          border-l border-[#1f1a2e] bg-[#0f0d14] shrink-0 overflow-hidden relative
          ${isMobile && isOpen ? "fixed inset-y-0 right-0 z-40 max-w-sm" : ""}
        `}
    >
      {/* Resize Handle */}
      {!isMobile && isOpen && (
        <div
          onMouseDown={onResizeStart}
          className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-[#7c6ba8]/50 active:bg-[#7c6ba8] transition-colors z-50 group"
        >
          <div className="absolute left-0 top-0 bottom-0 w-3 -translate-x-1" />
        </div>
      )}

      <div
        style={{
          width: !isMobile && isOpen ? width : undefined,
        }}
        className={`${isMobile ? "w-full" : ""} h-full flex flex-col relative`}
      >
        {/* Todos Header */}
        <div className="shrink-0 p-4 sm:p-6 pb-4 border-b border-[#1f1a2e]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-semibold text-[#e8e3f5]">
              Quick Tasks
            </h2>
            {/* Close button for mobile */}
            {isMobile && isOpen && (
              <button
                onClick={onClose}
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
  );
};

export default RightSidebarContainer;
