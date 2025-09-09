import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFolder, changeFolderName, getFolders } from "../api/folders";

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
      queryClient.invalidateQueries("folders");
    },
    onError: () => {
      throw new Error("Faile to fetch Folders");
    },
  });

  return mutate;
};

export const useEditFolderNameMutation = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: changeFolderName,
    onSuccess: () => {
      queryClient.invalidateQueries("folders");
    },
    onError: () => {
      throw new Error("Could not change folder name");
    },
  });
  return mutate;
};
