import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPages,
  getPage,
  createPage,
  updatePage,
  updatePageBlocks,
  deletePage,
  toggleFavorite,
  toggleArchive,
  addBlock,
  updateBlock,
  deleteBlock,
} from "../api/pages";
import React from "react";
import { FolderContext } from "../context/folderContext";
import { AlertContext } from "../context/alertContext";
import type { Block } from "../types/blocks";

// Get all pages in active folder
export const useGetPagesQuery = () => {
  const { activeFolderId } = React.useContext(FolderContext);

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["pages", activeFolderId],
    queryFn: async () => await getPages(activeFolderId),
    enabled: !!activeFolderId,
  });

  return { data, isPending, isFetching };
};

// Get single page with all blocks
export const useGetPageQuery = (pageId: string) => {
  const { data, isPending, isFetching } = useQuery({
    queryKey: ["page", pageId],
    queryFn: async () => await getPage(pageId),
    enabled: !!pageId,
  });

  return { data, isPending, isFetching };
};

// Create new page
export const useCreatePageMutation = () => {
  const queryClient = useQueryClient();
  const { activeFolderId } = React.useContext(FolderContext);
  const { openAlert } = React.useContext(AlertContext);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, icon }: { title?: string; icon?: string }) =>
      createPage(activeFolderId, title, icon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", activeFolderId] });
    },
    onError: () => {
      openAlert(
        "Error creating page",
        "There was a problem creating the page. Please try again."
      );
    },
  });

  return { mutate, isPending };
};

// Update page metadata
export const useUpdatePageMutation = (pageId: string) => {
  const queryClient = useQueryClient();
  const { activeFolderId } = React.useContext(FolderContext);
  const { openAlert } = React.useContext(AlertContext);

  const { mutate, isPending } = useMutation({
    mutationFn: (updates: {
      title?: string;
      icon?: string;
      coverImage?: string;
    }) => updatePage(pageId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
      queryClient.invalidateQueries({ queryKey: ["pages", activeFolderId] });
    },
    onError: () => {
      openAlert(
        "Error updating page",
        "There was a problem updating the page. Please try again."
      );
    },
  });

  return { mutate, isPending };
};

// Update all blocks (for autosave)
export const useUpdateBlocksMutation = (pageId: string) => {
  const queryClient = useQueryClient();
  const { openAlert } = React.useContext(AlertContext);

  const { mutate, isPending } = useMutation({
    mutationFn: (blocks: Block[]) => updatePageBlocks(pageId, blocks),
    onMutate: async (newBlocks) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["page", pageId] });

      // Snapshot previous value
      const previousPage = queryClient.getQueryData(["page", pageId]);

      // Optimistically update
      queryClient.setQueryData(["page", pageId], (old: any) => ({
        ...old,
        blocks: newBlocks,
      }));

      return { previousPage };
    },
    onError: (_err, _newBlocks, context) => {
      // Rollback on error
      queryClient.setQueryData(["page", pageId], context?.previousPage);
      openAlert(
        "Error saving changes",
        "Your changes couldn't be saved. Please try again."
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
    },
  });

  return { mutate, isPending };
};

// Add single block
export const useAddBlockMutation = (pageId: string) => {
  const queryClient = useQueryClient();
  const { openAlert } = React.useContext(AlertContext);

  const { mutate, isPending } = useMutation({
    mutationFn: (block: Omit<Block, "blockId" | "createdAt" | "updatedAt">) =>
      addBlock(pageId, block),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
    },
    onError: () => {
      openAlert(
        "Error adding block",
        "There was a problem adding the block. Please try again."
      );
    },
  });

  return { mutate, isPending };
};

// Update single block
export const useUpdateBlockMutation = (pageId: string) => {
  const queryClient = useQueryClient();
  const { openAlert } = React.useContext(AlertContext);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      blockId,
      updates,
    }: {
      blockId: string;
      updates: Partial<
        Pick<Block, "type" | "content" | "properties" | "order">
      >;
    }) => updateBlock(pageId, blockId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
    },
    onError: () => {
      openAlert(
        "Error updating block",
        "There was a problem updating the block. Please try again."
      );
    },
  });

  return { mutate, isPending };
};

// Delete single block
export const useDeleteBlockMutation = (pageId: string) => {
  const queryClient = useQueryClient();
  const { openAlert } = React.useContext(AlertContext);

  const { mutate, isPending } = useMutation({
    mutationFn: (blockId: string) => deleteBlock(pageId, blockId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
    },
    onError: () => {
      openAlert(
        "Error deleting block",
        "There was a problem deleting the block. Please try again."
      );
    },
  });

  return { mutate, isPending };
};

// Delete page
export const useDeletePageMutation = () => {
  const queryClient = useQueryClient();
  const { activeFolderId } = React.useContext(FolderContext);
  const { openAlert } = React.useContext(AlertContext);

  const { mutate, isPending } = useMutation({
    mutationFn: (pageId: string) => deletePage(pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", activeFolderId] });
    },
    onError: () => {
      openAlert(
        "Error deleting page",
        "There was a problem deleting the page. Please try again."
      );
    },
  });

  return { mutate, isPending };
};

// Toggle favorite
export const useToggleFavoriteMutation = (pageId: string) => {
  const queryClient = useQueryClient();
  const { activeFolderId } = React.useContext(FolderContext);

  const { mutate, isPending } = useMutation({
    mutationFn: (favorite: boolean) => toggleFavorite(pageId, favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
      queryClient.invalidateQueries({ queryKey: ["pages", activeFolderId] });
    },
  });

  return { mutate, isPending };
};

// Toggle archive
export const useToggleArchiveMutation = (pageId: string) => {
  const queryClient = useQueryClient();
  const { activeFolderId } = React.useContext(FolderContext);

  const { mutate, isPending } = useMutation({
    mutationFn: (archived: boolean) => toggleArchive(pageId, archived),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
      queryClient.invalidateQueries({ queryKey: ["pages", activeFolderId] });
    },
  });

  return { mutate, isPending };
};
