import { useContext, useEffect, useState, useRef, useCallback } from "react";
import Folder from "./Folder";
import { FaNoteSticky } from "react-icons/fa6";
import { AuthContext } from "../context/authcontext";
import { FolderContext } from "../context/folderContext";
import { LoaderIcon, X } from "lucide-react";
import { IoAdd } from "react-icons/io5";
import { useGetFoldersQuery } from "../queries/folderqueries";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 20;

interface SidebarProps {
  onAddFolderClick: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const Sidebar = ({ onAddFolderClick, onClose, isMobile }: SidebarProps) => {
  const [openIdx, setOpenIdx] = useState<number>(-1);
  const [activeFolder, setActiveFolder] = useState<number>(0);
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const auth = useContext(AuthContext);
  const { changeActiveFolder, activeFolderId } = useContext(FolderContext);
  const navigate = useNavigate();
  const { data, isPending } = useGetFoldersQuery();

  useEffect(() => {
    if (data) {
      setFolders(data);

      // Find the index of the active folder
      const activeIndex = data.findIndex(
        (folder: { id: string; name: string }) => folder.id === activeFolderId
      );

      if (activeIndex !== -1) {
        setActiveFolder(activeIndex);
      } else if (data.length > 0) {
        // If active folder not found but we have folders, set first one
        setActiveFolder(0);
        changeActiveFolder(data[0].id);
      }
    }
  }, [data, activeFolderId]);

  // Handle scroll to load more folders
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !folders.length) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Load more when scrolled 80% down
    if (scrollPercentage > 0.8 && visibleCount < folders.length) {
      setVisibleCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, folders.length)
      );
    }
  }, [folders.length, visibleCount]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleLogout = () => {
    auth?.logout();
    navigate("/signin");
  };

  if (isPending)
    return (
      <div className="min-h-screen w-full bg-[#0f0b16] border-r border-[#1f1a2e] flex items-center justify-center">
        <LoaderIcon className="animate-spin text-[#7c6ba8]" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-[#0f0b16] border-r border-[#1f1a2e] flex flex-col">
      {/* Header */}
      <div className="shrink-0 p-6 border-b border-[#1f1a2e]">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#7c6ba8]">
              <FaNoteSticky className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#e8e3f5]">TaskFlow</h1>
              <p className="text-xs text-[#6b5f88]">Organize your work</p>
            </div>
          </div>

          {/* Close button for mobile */}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="shrink-0 p-2 rounded-lg bg-[#1a1625] border border-[#2d2740] hover:bg-[#201a2e] text-[#c4b8e0]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Add Folder */}
        <button
          onClick={onAddFolderClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#7c6ba8] hover:bg-[#8b7fb8] !disabled:bg-[#584c76] text-white transition font-medium text-sm"
          disabled={isPending}
        >
          <IoAdd size={20} />
          New Folder
        </button>
      </div>

      {/* Folders List - Scrollable with lazy loading */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4"
        style={{ maxHeight: "calc(100vh - 250px)" }}
      >
        <div className="space-y-1">
          {folders
            .slice(0, visibleCount)
            .map((folder: { id: string; name: string }, index: number) => (
              <Folder
                key={folder.id}
                id={folder.id}
                title={folder.name}
                index={index}
                openIdx={openIdx}
                activeFolder={activeFolder}
                setOpenIdx={setOpenIdx}
                setActiveFolder={setActiveFolder}
              />
            ))}
          {visibleCount < folders.length && (
            <div className="flex items-center justify-center py-4">
              <LoaderIcon className="animate-spin text-[#7c6ba8]" size={20} />
              <span className="ml-2 text-xs text-[#6b5f88]">
                Loading more... ({visibleCount}/{folders.length})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button - Fixed at bottom */}
      <div className="shrink-0 p-4 border-t border-[#1f1a2e] bg-[#0f0b16]">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 rounded-lg bg-[#1a1625] hover:bg-[#201a2e] text-[#c4b8e0] transition text-sm font-medium border border-[#2d2740]"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
