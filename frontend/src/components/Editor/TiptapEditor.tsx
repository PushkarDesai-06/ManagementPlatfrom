import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect } from "react";

interface TiptapEditorProps {
  content: any;
  onChange: (content: any) => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  onEditorReady?: (editor: any) => void;
}

export const TiptapEditor = ({
  content,
  onChange,
  placeholder = "Type '/' for commands...",
  autoFocus = false,
  editable = true,
  onEditorReady,
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: "min-h-[500px] outline-none text-[#e8e3f5] px-4",
      },
    },
  });

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (
      editor &&
      content &&
      JSON.stringify(editor.getJSON()) !== JSON.stringify(content)
    ) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #6b5f88;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 1.5rem 0 0.5rem;
          color: #e8e3f5;
        }
        .ProseMirror h2 {
          font-size: 2rem;
          font-weight: 600;
          line-height: 1.3;
          margin: 1.25rem 0 0.5rem;
          color: #e8e3f5;
        }
        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 1rem 0 0.5rem;
          color: #e8e3f5;
        }
        .ProseMirror p {
          margin: 0.75rem 0;
          line-height: 1.6;
          color: #c4b8e0;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.75rem 0;
          color: #c4b8e0;
        }
        .ProseMirror ul {
          list-style-type: disc;
        }
        .ProseMirror ol {
          list-style-type: decimal;
        }
        .ProseMirror li {
          margin: 0.25rem 0;
          line-height: 1.6;
        }
        .ProseMirror li p {
          margin: 0;
        }
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .ProseMirror ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
          margin-top: 0.25rem;
        }
        .ProseMirror ul[data-type="taskList"] li > label input[type="checkbox"] {
          width: 1.125rem;
          height: 1.125rem;
          cursor: pointer;
          accent-color: #3b82f6;
        }
        .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }
        .ProseMirror ul[data-type="taskList"] li[data-checked="true"] > div {
          text-decoration: line-through;
          opacity: 0.6;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #c4b8e0;
          font-style: italic;
        }
        .ProseMirror code {
          background-color: #2d2740;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          color: #e8e3f5;
          font-family: 'Courier New', monospace;
        }
        .ProseMirror pre {
          background-color: #1a1625;
          border: 1px solid #2d2740;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .ProseMirror pre code {
          background: none;
          padding: 0;
          color: #c4b8e0;
        }
        .ProseMirror strong {
          font-weight: 700;
          color: #e8e3f5;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror s {
          text-decoration: line-through;
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #2d2740;
          margin: 2rem 0;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
