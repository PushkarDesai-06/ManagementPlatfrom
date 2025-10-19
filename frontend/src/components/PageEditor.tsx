import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { ArrowLeft, Star, Archive, MoreVertical } from "lucide-react";
import type { Block } from "../types/blocks";

export const PageEditor = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { data: page, isPending } = useGetPageQuery(pageId || "");
  const { mutate: updateBlocks } = useUpdateBlocksMutation(pageId || "");
  const { mutate: updatePage } = useUpdatePageMutation(pageId || "");

  const [content, setContent] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [debouncedContent] = useDebounce(content, 1000);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);

  // Load initial content
  useEffect(() => {
    if (page) {
      setTitle(page.title);
      if (page.blocks && page.blocks.length > 0) {
        setContent(page.blocks[0].content);
      } else {
        setContent({ type: "doc", content: [] });
      }
    }
  }, [page]);

  // Autosave content
  useEffect(() => {
    if (
      debouncedContent &&
      page &&
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

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!isPending && !page) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Page not found
          </h2>
          <p className="text-gray-600 mb-4">
            The page you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Back to home"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{page.icon}</span>
            <span className="text-sm text-gray-500">
              {lastSaved
                ? `Saved ${lastSaved.toLocaleTimeString()}`
                : "All changes saved"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Favorite"
          >
            <Star
              size={20}
              className={
                page.metadata.favorite ? "fill-yellow-400 text-yellow-400" : ""
              }
            />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Archive"
          >
            <Archive size={20} />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="More options"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Page Title */}
      <div className="px-16 pt-8 pb-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="text-5xl font-bold w-full outline-none placeholder-gray-300"
          placeholder="Untitled"
        />
      </div>

      {/* Editor */}
      <TiptapEditor
        content={content}
        onChange={handleChange}
        onEditorReady={handleEditorReady}
        autoFocus
      />
    </div>
  );
};

export default PageEditor;
