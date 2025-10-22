import { useState, useCallback, useEffect, useRef } from "react";
import { TiptapEditor } from "./Editor/TiptapEditor";
import { EditorToolbar } from "./Editor/EditorToolbar";
import {
  useGetPageQuery,
  useUpdateBlocksMutation,
  useUpdatePageMutation,
} from "../queries/pagequeries";
import { useDebounce } from "use-debounce";
import { nanoid } from "nanoid";
import type { Editor } from "@tiptap/react";
import { X, Maximize2, Minimize2, Save } from "lucide-react";
import type { Block } from "../types/blocks";

interface PageEditorModalProps {
  pageId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PageEditorModal = ({
  pageId,
  isOpen,
  onClose,
}: PageEditorModalProps) => {
  const { data: page, isPending } = useGetPageQuery(pageId);
  const { mutate: updateBlocks } = useUpdateBlocksMutation(pageId);
  const { mutate: updatePage } = useUpdatePageMutation(pageId);

  const [content, setContent] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [debouncedContent] = useDebounce(content, 1000);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Track if content has been initialized to prevent overwriting user input
  const contentInitializedRef = useRef(false);
  const currentPageIdRef = useRef<string | null>(null);

  // Load initial content only once per page or when page changes
  useEffect(() => {
    // Reset initialization flag when pageId changes
    if (currentPageIdRef.current !== pageId) {
      contentInitializedRef.current = false;
      currentPageIdRef.current = pageId;
    }

    // Only initialize content once per page load
    if (page && !contentInitializedRef.current) {
      setTitle(page.title);
      if (page.blocks && page.blocks.length > 0) {
        setContent(page.blocks[0].content);
      } else {
        setContent({ type: "doc", content: [] });
      }
      contentInitializedRef.current = true;
    }
  }, [page, pageId]);

  // Autosave content
  useEffect(() => {
    if (
      debouncedContent &&
      page &&
      contentInitializedRef.current &&
      JSON.stringify(debouncedContent) !==
        JSON.stringify(page.blocks[0]?.content)
    ) {
      const blocks: Block[] = [
        {
          blockId: page.blocks[0]?.blockId || nanoid(),
          type: "text",
          content: debouncedContent,
          properties: {},
          order: 0,
          parentId: null,
          createdAt: page.blocks[0]?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      updateBlocks(blocks, {
        onSuccess: () => {
          setLastSaved(new Date());
        },
        onError: (error) => {
          console.error("Failed to save content:", error);
        },
      });
    }
  }, [debouncedContent, page, updateBlocks]);

  // Debounce title updates
  const [debouncedTitle] = useDebounce(title, 1000);

  useEffect(() => {
    if (debouncedTitle && page && debouncedTitle !== page.title) {
      updatePage({ title: debouncedTitle });
    }
  }, [debouncedTitle, page, updatePage]);

  const handleChange = useCallback((newContent: any) => {
    setContent(newContent);
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleEditorReady = useCallback((editorInstance: Editor) => {
    setEditor(editorInstance);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    // Reset initialization flag when closing modal
    contentInitializedRef.current = false;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`absolute bg-[#13111c] border border-[#2d2740] shadow-2xl transition-all duration-300 ${
          isFullscreen
            ? "inset-0"
            : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-5xl h-[90vh] rounded-xl max-sm:w-full max-sm:h-full max-sm:rounded-none"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 bg-[#1a1625] border-b border-[#2d2740] px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{page?.icon || "📄"}</span>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="text-lg font-semibold bg-transparent text-[#e8e3f5] outline-none border-none placeholder-[#6b5f88] w-64"
                  placeholder="Untitled"
                />
                <span className="text-xs text-[#6b5f88] flex items-center gap-1">
                  <Save size={12} />
                  {lastSaved
                    ? `Saved ${lastSaved.toLocaleTimeString()}`
                    : "All changes saved"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-[#2d2740] rounded transition-colors text-[#c4b8e0]"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 size={20} />
                ) : (
                  <Maximize2 size={20} />
                )}
              </button>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-[#2d2740] rounded transition-colors text-[#c4b8e0]"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isPending ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-[#6b5f88]">Loading page...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex-shrink-0 border-b border-[#2d2740]">
                <EditorToolbar editor={editor} />
              </div>

              {/* Editor Content */}
              <div className="flex-1 overflow-y-auto px-16 py-6 max-sm:px-4 max-sm:py-4">
                <TiptapEditor
                  content={content}
                  onChange={handleChange}
                  onEditorReady={handleEditorReady}
                  autoFocus
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageEditorModal;
