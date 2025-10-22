import { useContext } from "react";
import { FolderContext } from "../context/folderContext";
import { useDeleteFolderMutation } from "../queries/folderqueries";

interface UseFolderActionsReturn {
  handleDeleteClick: () => void;
}

export const useFolderActions = (
  folderData: { id: string; name: string }[] | undefined
): UseFolderActionsReturn => {
  const { activeFolderId, changeActiveFolder } = useContext(FolderContext);
  const { mutate: DeleteMutation } = useDeleteFolderMutation();

  const handleDeleteClick = () => {
    if (!folderData || folderData.length === 0) return;

    if (confirm("Are you sure you want to delete this folder?") !== true) {
      return;
    }

    const activeFolderIndex = folderData.findIndex(
      (folder: { id: string; name: string }) => folder.id === activeFolderId
    );

    console.log("active folder index:", activeFolderIndex);
    console.log("folders length:", folderData.length);

    // If this is the last folder, don't delete
    if (folderData.length === 1) {
      console.log("Cannot delete the last folder");
      return;
    }

    // If deleting the last item in the list, go to previous
    // Otherwise, stay at the same index (which will be the next item after deletion)
    let nextFolderId: string;

    if (activeFolderIndex === folderData.length - 1) {
      // Deleting last item, go to previous
      nextFolderId = folderData[activeFolderIndex - 1].id;
    } else {
      // Not last item, next item will shift into this position
      nextFolderId = folderData[activeFolderIndex + 1].id;
    }

    const prevFolderId = activeFolderId;

    console.log("nextFolderId:", nextFolderId);
    console.log("prevFolderId:", prevFolderId);

    // Change to the next folder BEFORE deleting
    changeActiveFolder(nextFolderId);

    // Small delay to ensure state update, then delete
    setTimeout(() => {
      DeleteMutation(prevFolderId);
    }, 50);
  };

  return {
    handleDeleteClick,
  };
};
