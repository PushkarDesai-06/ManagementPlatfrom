import { useContext } from "react";
import { FloatingInput } from "../components/FloatingInput";
import Sidebar from "../components/Sidebar";
import TodoList from "../components/TodoList";
import {
  useDeleteFolderMutation,
  useGetFoldersQuery,
} from "../queries/folderqueries";
import { FolderContext } from "../context/folderContext";

const Home = () => {
  const { data: folderData } = useGetFoldersQuery();
  const { activeFolderId, folders, changeActiveFolder } =
    useContext(FolderContext);
  console.log(activeFolderId);
  const { mutate: DeleteMutation } = useDeleteFolderMutation();

  const handleDeleteClick = () => {
    const activeFolderIndex = folders.findIndex(
      (folder) => folder.id === activeFolderId
    );

    const nextFolderIndex =
      folders.length > activeFolderIndex ? activeFolderIndex + 1 : 0;
    const prevFolderId = activeFolderId;
    console.log("folders", folderData);
    changeActiveFolder(folderData[nextFolderIndex].id);
    DeleteMutation(prevFolderId);
  };

  const activeFolderName =
    (folderData &&
      activeFolderId &&
      folderData.find(
        (elem: { id: string; name: string }) => elem.id == activeFolderId
      ) &&
      folderData.find(
        (elem: { id: string; name: string }) => elem.id == activeFolderId
      ).name) ||
    "Loading...";

  return (
    <div className="flex">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1 mt-8">
        <div className="text-center py-4 text-xl bg-neutral-200 rounded-full mx-24 border border-neutral-300 flex justify-center items-center">
          <div className="flex-1 font-rubik">{activeFolderName}</div>
          <div className="">
            <button
              className="w-32 h-12 bg-red-500 rounded-full border border-red-300 text-white font-ubuntu mx-4"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        </div>
        <div className="mx-4 px-2 py-1 flex justify-center">
          <TodoList />
          <FloatingInput />
        </div>
      </div>
    </div>
  );
};

export default Home;
