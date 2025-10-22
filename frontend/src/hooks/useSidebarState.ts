import { useState, useEffect } from "react";

interface UseSidebarStateReturn {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  isMobile: boolean;
  setIsLeftSidebarOpen: (value: boolean) => void;
  setIsRightSidebarOpen: (value: boolean) => void;
}

export const useSidebarState = (): UseSidebarStateReturn => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  return {
    isLeftSidebarOpen,
    isRightSidebarOpen,
    isMobile,
    setIsLeftSidebarOpen,
    setIsRightSidebarOpen,
  };
};
