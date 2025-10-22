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
    onMutate: async ({ title, icon }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["pages", activeFolderId],
      });

      // Snapshot previous value
      const previousPages = queryClient.getQueryData(["pages", activeFolderId]);

      // Optimistically add new page
      queryClient.setQueryData(["pages", activeFolderId], (old: any) => {
        const newPage = {
          pageId: `temp-${Date.now()}`,
          title: title || "Untitled",
          icon: icon || "📄",
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastEditedBy: "current-user",
            favorite: false,
            archived: false,
          },
        };
        return old ? [...old, newPage] : [newPage];
      });

      return { previousPages };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", activeFolderId] });
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["pages", activeFolderId],
        context?.previousPages
      );
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
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["page", pageId] });
      await queryClient.cancelQueries({
        queryKey: ["pages", activeFolderId],
      });

      // Snapshot previous values
      const previousPage = queryClient.getQueryData(["page", pageId]);
      const previousPages = queryClient.getQueryData(["pages", activeFolderId]);

      // Optimistically update page detail
      queryClient.setQueryData(["page", pageId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          ...updates,
          metadata: {
            ...old.metadata,
            updatedAt: new Date().toISOString(),
          },
        };
      });

      // Optimistically update page in list
      queryClient.setQueryData(["pages", activeFolderId], (old: any) => {
        if (!old) return old;
        return old.map((page: any) =>
          page.pageId === pageId
            ? {
                ...page,
                ...updates,
                metadata: {
                  ...page.metadata,
                  updatedAt: new Date().toISOString(),
                },
              }
            : page
        );
      });

      return { previousPage, previousPages };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
      queryClient.invalidateQueries({ queryKey: ["pages", activeFolderId] });
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      queryClient.setQueryData(["page", pageId], context?.previousPage);
      queryClient.setQueryData(
        ["pages", activeFolderId],
        context?.previousPages
      );
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
    onMutate: async (newBlock) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["page", pageId] });

      // Snapshot previous value
      const previousPage = queryClient.getQueryData(["page", pageId]);

      // Optimistically add block
      queryClient.setQueryData(["page", pageId], (old: any) => {
        if (!old) return old;
        const tempBlock = {
          ...newBlock,
          blockId: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return {
          ...old,
          blocks: [...(old.blocks || []), tempBlock],
        };
      });

      return { previousPage };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
    },
    onError: (_err, _newBlock, context) => {
      // Rollback on error
      queryClient.setQueryData(["page", pageId], context?.previousPage);
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
    onMutate: async ({ blockId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["page", pageId] });

      // Snapshot previous value
      const previousPage = queryClient.getQueryData(["page", pageId]);

      // Optimistically update block
      queryClient.setQueryData(["page", pageId], (old: any) => {
        if (!old || !old.blocks) return old;
        return {
          ...old,
          blocks: old.blocks.map((block: Block) =>
            block.blockId === blockId
              ? {
                  ...block,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : block
          ),
        };
      });

      return { previousPage };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      queryClient.setQueryData(["page", pageId], context?.previousPage);
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
    onMutate: async (blockId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["page", pageId] });

      // Snapshot previous value
      const previousPage = queryClient.getQueryData(["page", pageId]);

      // Optimistically remove block
      queryClient.setQueryData(["page", pageId], (old: any) => {
        if (!old || !old.blocks) return old;
        return {
          ...old,
          blocks: old.blocks.filter(
            (block: Block) => block.blockId !== blockId
          ),
        };
      });

      return { previousPage };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
    },
    onError: (_err, _blockId, context) => {
      // Rollback on error
      queryClient.setQueryData(["page", pageId], context?.previousPage);
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
    onMutate: async (pageId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["pages", activeFolderId],
      });

      // Snapshot previous value
      const previousPages = queryClient.getQueryData(["pages", activeFolderId]);

      // Optimistically remove page
      queryClient.setQueryData(["pages", activeFolderId], (old: any) => {
        if (!old) return old;
        return old.filter((page: any) => page.pageId !== pageId);
      });

      return { previousPages };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", activeFolderId] });
    },
    onError: (_err, _pageId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["pages", activeFolderId],
        context?.previousPages
      );
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
    onMutate: async (favorite) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["page", pageId] });
      await queryClient.cancelQueries({
        queryKey: ["pages", activeFolderId],
      });

      // Snapshot previous values
      const previousPage = queryClient.getQueryData(["page", pageId]);
      const previousPages = queryClient.getQueryData(["pages", activeFolderId]);

      // Optimistically update
      queryClient.setQueryData(["page", pageId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          metadata: {
            ...old.metadata,
            favorite: favorite,
          },
        };
      });

      queryClient.setQueryData(["pages", activeFolderId], (old: any) => {
        if (!old) return old;
        return old.map((page: any) =>
          page.pageId === pageId
            ? {
                ...page,
                metadata: {
                  ...page.metadata,
                  favorite: favorite,
                },
              }
            : page
        );
      });

      return { previousPage, previousPages };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
      queryClient.invalidateQueries({ queryKey: ["pages", activeFolderId] });
    },
    onError: (_err, _favorite, context) => {
      // Rollback on error
      queryClient.setQueryData(["page", pageId], context?.previousPage);
      queryClient.setQueryData(
        ["pages", activeFolderId],
        context?.previousPages
      );
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
    onMutate: async (archived) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["page", pageId] });
      await queryClient.cancelQueries({
        queryKey: ["pages", activeFolderId],
      });

      // Snapshot previous values
      const previousPage = queryClient.getQueryData(["page", pageId]);
      const previousPages = queryClient.getQueryData(["pages", activeFolderId]);

      // Optimistically update
      queryClient.setQueryData(["page", pageId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          metadata: {
            ...old.metadata,
            archived: archived,
          },
        };
      });

      queryClient.setQueryData(["pages", activeFolderId], (old: any) => {
        if (!old) return old;
        return old.map((page: any) =>
          page.pageId === pageId
            ? {
                ...page,
                metadata: {
                  ...page.metadata,
                  archived: archived,
                },
              }
            : page
        );
      });

      return { previousPage, previousPages };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
      queryClient.invalidateQueries({ queryKey: ["pages", activeFolderId] });
    },
    onError: (_err, _archived, context) => {
      // Rollback on error
      queryClient.setQueryData(["page", pageId], context?.previousPage);
      queryClient.setQueryData(
        ["pages", activeFolderId],
        context?.previousPages
      );
    },
  });

  return { mutate, isPending };
};
