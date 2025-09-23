import axios from "../lib/axios";

export const getFolders = async () => {
  try {
    const req = await axios.get("/folder");
    if (!req.data.folders) return [];
    return req.data.folders;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const addFolder = async (name: String) => {
  try {
    const updatedFolders = await axios.post("/folder", { name });
    return updatedFolders;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating folders!");
  }
};

export const changeFolderName = async ({
  id,
  newName,
}: {
  id: string;
  newName: string;
}) => {
  try {
    const updatedFolders = await axios.put("/folder/", {
      id,
      newName,
    });
    return updatedFolders;
  } catch (error) {
    throw new Error("Error changing folder name");
  }
};

export const deleteFolder = async (folderId: string) => {
  try {
    const updatedFolders = await axios.delete(`/folder/${folderId}`);
    return updatedFolders;
  } catch (error) {
    throw new Error("Error Deleting Folder");
  }
};
