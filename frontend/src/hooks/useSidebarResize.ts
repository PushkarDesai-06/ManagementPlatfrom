import { useState, useEffect } from "react";

interface UseSidebarResizeReturn {
  rightSidebarWidth: number;
  isResizing: boolean;
  handleResizeStart: () => void;
}

export const useSidebarResize = (
  minWidth: number = 384
): UseSidebarResizeReturn => {
  const [rightSidebarWidth, setRightSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("rightSidebarWidth");
    return saved ? parseInt(saved) : minWidth;
  });
  const [isResizing, setIsResizing] = useState(false);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= minWidth && newWidth <= 800) {
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
  }, [isResizing, minWidth]);

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  return {
    rightSidebarWidth,
    isResizing,
    handleResizeStart,
  };
};
