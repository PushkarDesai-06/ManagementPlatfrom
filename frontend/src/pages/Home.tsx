import { useContext, useState } from "react";
import PageList from "../components/PageList";
import { motion } from "framer-motion";
import { useGetFoldersQuery } from "../queries/folderqueries";
import { FolderContext } from "../context/folderContext";
import { createPortal } from "react-dom";
import AddFolderPopup from "../components/AddFolderPopup";
import HomeHeader from "../components/HomeHeader";
import LeftSidebarContainer from "../components/LeftSidebarContainer";
import RightSidebarContainer from "../components/RightSidebarContainer";
import { useSidebarState } from "../hooks/useSidebarState";
import { useSidebarResize } from "../hooks/useSidebarResize";
import { useFolderActions } from "../hooks/useFolderActions";

const Home = () => {
  const { data: folderData } = useGetFoldersQuery();
  const { activeFolderId } = useContext(FolderContext);
  const [showAddFolderPopup, setShowAddFolderPopup] = useState(false);

  // Custom hooks for sidebar state and resize
  const MIN_RIGHT_SIDEBAR_WIDTH = 384;
  const {
    isLeftSidebarOpen,
    isRightSidebarOpen,
    isMobile,
    setIsLeftSidebarOpen,
    setIsRightSidebarOpen,
  } = useSidebarState();

  const { rightSidebarWidth, handleResizeStart } = useSidebarResize(
    MIN_RIGHT_SIDEBAR_WIDTH
  );

  const { handleDeleteClick } = useFolderActions(folderData);

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

        {/* Left Sidebar */}
        <LeftSidebarContainer
          isOpen={isLeftSidebarOpen}
          isMobile={isMobile}
          onClose={() => setIsLeftSidebarOpen(false)}
          onAddFolderClick={() => setShowAddFolderPopup(true)}
        />

        {/* Main Content Area - Pages */}
        <div className="flex-1 flex flex-col h-screen relative min-w-0">
          {/* Header */}
          <HomeHeader
            activeFolderName={activeFolderName}
            isLeftSidebarOpen={isLeftSidebarOpen}
            isRightSidebarOpen={isRightSidebarOpen}
            isMobile={isMobile}
            folderData={folderData}
            onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            onToggleRightSidebar={() =>
              setIsRightSidebarOpen(!isRightSidebarOpen)
            }
            onDeleteClick={handleDeleteClick}
          />

          {/* Pages Content */}
          <PageList />
        </div>

        {/* Right Sidebar - Todos */}
        <RightSidebarContainer
          isOpen={isRightSidebarOpen}
          isMobile={isMobile}
          width={rightSidebarWidth}
          onClose={() => setIsRightSidebarOpen(false)}
          onResizeStart={handleResizeStart}
        />
      </div>
    </>
  );
};

export default Home;
