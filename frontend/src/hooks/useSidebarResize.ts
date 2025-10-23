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

  // Adjust sidebar width on window resize to respect constraints
  useEffect(() => {
    const handleWindowResize = () => {
      const maxWidth = Math.min(800, window.innerWidth - 320 - 400);

      setRightSidebarWidth((currentWidth) => {
        // If current width exceeds new maximum, adjust it
        if (currentWidth > maxWidth) {
          const newWidth = Math.max(minWidth, maxWidth);
          localStorage.setItem("rightSidebarWidth", String(newWidth));
          return newWidth;
        }
        return currentWidth;
      });
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [minWidth]);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;

      // Calculate maximum width to preserve 400px minimum for pages container
      // Left sidebar: 320px, Pages minimum: 400px
      const maxWidth = Math.min(800, window.innerWidth - 320 - 400);

      if (newWidth >= minWidth && newWidth <= maxWidth) {
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
