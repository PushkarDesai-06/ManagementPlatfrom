// Block Types
export type BlockType =
  | "text"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bulletList"
  | "numberedList"
  | "todo"
  | "code"
  | "quote"
  | "callout"
  | "divider"
  | "image"
  | "video"
  | "file"
  | "table"
  | "embed";

// Block Structure
export interface Block {
  blockId: string;
  type: BlockType;
  content: any; // JSON content from editor (Tiptap, Slate, etc.)
  properties: {
    checked?: boolean; // For todo blocks
    language?: string; // For code blocks
    level?: number; // For headings
    color?: string; // For callouts/text
    backgroundColor?: string;
    align?: "left" | "center" | "right";
    url?: string; // For images/videos/files
    caption?: string; // For media blocks
    [key: string]: any; // Extensible for future properties
  };
  order: number;
  parentId?: string | null; // For nested blocks (e.g., list items)
  createdAt: string;
  updatedAt: string;
}

// Page Metadata
export interface PageMetadata {
  createdAt: string;
  updatedAt: string;
  lastEditedBy: string;
  favorite: boolean;
  archived: boolean;
}

// Page Structure
export interface Page {
  pageId: string;
  folderId: string;
  title: string;
  icon: string; // Emoji or icon identifier
  coverImage?: string; // URL to cover image
  blocks: Block[];
  metadata: PageMetadata;
}

// Page List Item (for sidebar/folder view)
export interface PageListItem {
  pageId: string;
  title: string;
  icon: string;
  metadata: PageMetadata;
}

// Existing types (keep for backward compatibility during migration)
export type formDataInterface = {
  email: string;
  password: string;
};

export type NavBarProps = {
  activeHref: string;
};

export type ProfileCardProps = {
  handleEditClick: (e: React.MouseEvent) => void;
  name: string;
  city: string;
  countryCode: string;
  handle: string;
  description?: string;
  pfpUrl?: string;
};

export type TodoProps = {
  text: string;
  todoId: string;
  date: Date;
};

export type OptionsProps = {
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  todoId: string;
};

// Editor Props
export interface EditorProps {
  content: any;
  onChange: (content: any) => void;
  onBlockAdd?: (block: Block) => void;
  onBlockDelete?: (blockId: string) => void;
  onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
}

// Slash Command
export interface SlashCommand {
  id: string;
  icon: string;
  label: string;
  description?: string;
  command: BlockType;
  keywords?: string[];
}

// Toolbar Button
export interface ToolbarButton {
  id: string;
  icon: React.ReactNode;
  label: string;
  action: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  shortcut?: string;
}
