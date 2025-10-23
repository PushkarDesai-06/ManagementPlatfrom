import { useContext, useState } from "react";
import { FolderContext } from "../context/folderContext";
import {
  useGetPagesQuery,
  useCreatePageMutation,
  useDeletePageMutation,
} from "../queries/pagequeries";
import { motion } from "framer-motion";
import { Plus, FileText, Star, Trash2 } from "lucide-react";
import type { PageListItem } from "../types/blocks";
import { PageEditorModal } from "./PageEditorModal";

export const PageList = () => {
  const { activeFolderId } = useContext(FolderContext);
  const { data: pages, isPending } = useGetPagesQuery();
  const { mutate: createPage, isPending: isCreating } = useCreatePageMutation();
  const { mutate: deletePage } = useDeletePageMutation();

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatePage = () => {
    if (!activeFolderId) return;

    createPage(
      { title: "Untitled", icon: "📄" },
      {
        onSuccess: (newPage) => {
          setSelectedPageId(newPage.pageId);
          setIsModalOpen(true);
        },
      }
    );
  };

  const handlePageClick = (pageId: string) => {
    setSelectedPageId(pageId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPageId(null);
  };

  const handleDeletePage = (e: React.MouseEvent, pageId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this page?")) {
      deletePage(pageId);
    }
  };

  if (!activeFolderId) {
    return (
      <div className="p-8 text-center text-gray-500">
        Select a folder to view pages
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-[400px]">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        transition={{ delay: 0.3 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center p-8 pb-4 border-b border-[#1f1a2e] flex-shrink-0"
      >
        <div>
          <h1 className="text-2xl font-semibold text-[#e8e3f5]">Pages</h1>
          <p className="text-sm text-[#6b5f88] mt-1">
            {pages?.length || 0} page{pages?.length !== 1 ? "s" : ""} in this
            folder
          </p>
        </div>
        <button
          onClick={handleCreatePage}
          disabled={isCreating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          New Page
        </button>
      </motion.div>

      {/* Page List */}
      <div className="flex-1 overflow-y-auto px-8 py-4 @container">
        {isPending ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : pages && pages.length > 0 ? (
          <div className="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 gap-4">
            {pages.map((page: PageListItem, index: number) => (
              <motion.div
                key={page.pageId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handlePageClick(page.pageId)}
                className="group relative bg-[#1a1625] border border-[#2d2740] rounded-lg p-4 hover:border-[#3d3450] cursor-pointer transition-all"
              >
                {/* Page Icon & Title */}
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{page.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#e8e3f5] font-medium truncate">
                      {page.title || "Untitled"}
                    </h3>
                    <p className="text-xs text-[#6b5f88] mt-1">
                      Updated{" "}
                      {new Date(page.metadata.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  {page.metadata.favorite && (
                    <div className="p-1.5 bg-[#2d2740] rounded">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    </div>
                  )}
                  <button
                    onClick={(e) => handleDeletePage(e, page.pageId)}
                    className="p-1.5 bg-[#2d2740] rounded hover:bg-red-600 transition-colors"
                    title="Delete page"
                  >
                    <Trash2 size={14} className="text-[#c4b8e0]" />
                  </button>
                </div>

                {/* Archived Badge */}
                {page.metadata.archived && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs bg-[#2d2740] text-[#6b5f88] rounded">
                      Archived
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <FileText size={48} className="text-[#6b5f88] mb-4" />
            <h3 className="text-lg font-medium text-[#e8e3f5] mb-2">
              No pages yet
            </h3>
            <p className="text-sm text-[#6b5f88] mb-4">
              Create your first page to get started
            </p>
            <button
              onClick={handleCreatePage}
              disabled={isCreating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition text-sm font-medium disabled:opacity-50"
            >
              <Plus size={18} />
              New Page
            </button>
          </motion.div>
        )}
      </div>

      {/* Page Editor Modal */}
      {selectedPageId && (
        <PageEditorModal
          pageId={selectedPageId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default PageList;
