import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFolder,
  changeFolderName,
  deleteFolder,
  getFolders,
} from "../api/folders";

export const useGetFoldersQuery = () => {
  const { data, isPending } = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });
  return { data, isPending };
};

export const useAddFolderMutation = () => {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: addFolder,
    onMutate: async (newFolderName: String) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["folders"] });

      // Snapshot previous value
      const previousFolders = queryClient.getQueryData(["folders"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["folders"], (old: any) => {
        if (!old) return [{ id: `temp-${Date.now()}`, name: newFolderName }];
        return [...old, { id: `temp-${Date.now()}`, name: newFolderName }];
      });

      return { previousFolders };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (_err, _newFolder, context) => {
      // Rollback on error
      queryClient.setQueryData(["folders"], context?.previousFolders);
    },
  });

  return { mutate, isPending };
};

export const useEditFolderNameMutation = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: changeFolderName,
    onMutate: async ({ id, newName }: { id: string; newName: string }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["folders"] });

      // Snapshot previous value
      const previousFolders = queryClient.getQueryData(["folders"]);

      // Optimistically update
      queryClient.setQueryData(["folders"], (old: any) => {
        if (!old) return old;
        return old.map((folder: { id: string; name: string }) =>
          folder.id === id ? { ...folder, name: newName } : folder
        );
      });

      return { previousFolders };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      queryClient.setQueryData(["folders"], context?.previousFolders);
    },
  });
  return mutate;
};

export const useDeleteFolderMutation = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteFolder,
    onMutate: async (folderId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["folders"] });

      // Snapshot previous value
      const previousFolders = queryClient.getQueryData(["folders"]);

      // Optimistically update
      queryClient.setQueryData(["folders"], (old: any) => {
        if (!old) return old;
        return old.filter((folder: { id: string }) => folder.id !== folderId);
      });

      return { previousFolders };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (_err, _folderId, context) => {
      // Rollback on error
      queryClient.setQueryData(["folders"], context?.previousFolders);
    },
  });
  return { mutate, isPending };
};
