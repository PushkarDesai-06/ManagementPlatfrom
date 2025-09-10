import axios from "../lib/axios";

export const getFolders = async () => {
  try {
    const req = await axios.get("/folder");
    // console.log(req.data.folders);
    if (req.data.folders) return req.data.folders;
    return [];
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const addFolder = async (name: String) => {
  try {
    const updatedFolders = await axios.post("/folder/addfolder", { name });
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
    const updatedFolders = await axios.post("/folder/changefoldername", {
      id,
      newName,
    });
    return updatedFolders;
  } catch (error) {
    throw new Error("Error changing folder name");
  }
};
