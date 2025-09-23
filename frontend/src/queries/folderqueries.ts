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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: () => {
      throw new Error("Failed to fetch Folders");
    },
  });

  return { mutate, isPending };
};

export const useEditFolderNameMutation = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: changeFolderName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: () => {
      throw new Error("Could not change folder name");
    },
  });
  return mutate;
};

export const useDeleteFolderMutation = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: () => {
      throw new Error("Could Not Delete Folder");
    },
  });
  return { mutate, isPending };
};
