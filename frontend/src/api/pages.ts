import axios from "../lib/axios";
import type { Page, PageListItem, Block } from "../types/blocks";

// Get all pages in a folder
export const getPages = async (folderId: string): Promise<PageListItem[]> => {
  try {
    const res = await axios.get(`/page?folderId=${folderId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch pages");
  }
};

// Get single page with all blocks
export const getPage = async (pageId: string): Promise<Page> => {
  try {
    const res = await axios.get(`/page/${pageId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch page");
  }
};

// Create new page
export const createPage = async (
  folderId: string,
  title?: string,
  icon?: string
): Promise<Page> => {
  try {
    const res = await axios.post("/page", {
      folderId,
      title: title || "Untitled",
      icon: icon || "📄",
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create page");
  }
};

// Update page metadata (title, icon, cover)
export const updatePage = async (
  pageId: string,
  updates: { title?: string; icon?: string; coverImage?: string }
): Promise<Page> => {
  try {
    const res = await axios.put(`/page/${pageId}`, updates);
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update page");
  }
};

// Update all blocks (full replace)
export const updatePageBlocks = async (
  pageId: string,
  blocks: Block[]
): Promise<Page> => {
  try {
    const res = await axios.put(`/page/${pageId}/blocks`, { blocks });
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update blocks");
  }
};

// Add single block
export const addBlock = async (
  pageId: string,
  block: Omit<Block, "blockId" | "createdAt" | "updatedAt">
): Promise<Block> => {
  try {
    const res = await axios.post(`/page/${pageId}/blocks`, block);
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add block");
  }
};

// Update single block
export const updateBlock = async (
  pageId: string,
  blockId: string,
  updates: Partial<Pick<Block, "type" | "content" | "properties" | "order">>
): Promise<Block> => {
  try {
    const res = await axios.put(`/page/${pageId}/blocks/${blockId}`, updates);
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update block");
  }
};

// Delete single block
export const deleteBlock = async (
  pageId: string,
  blockId: string
): Promise<void> => {
  try {
    await axios.delete(`/page/${pageId}/blocks/${blockId}`);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete block");
  }
};

// Delete page
export const deletePage = async (pageId: string): Promise<void> => {
  try {
    await axios.delete(`/page/${pageId}`);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete page");
  }
};

// Toggle favorite
export const toggleFavorite = async (
  pageId: string,
  favorite: boolean
): Promise<Page> => {
  try {
    const res = await axios.patch(`/page/${pageId}/favorite`, { favorite });
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to toggle favorite");
  }
};

// Toggle archive
export const toggleArchive = async (
  pageId: string,
  archived: boolean
): Promise<Page> => {
  try {
    const res = await axios.patch(`/page/${pageId}/archive`, { archived });
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to toggle archive");
  }
};
