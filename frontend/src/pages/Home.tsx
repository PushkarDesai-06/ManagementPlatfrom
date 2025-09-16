import { useContext } from "react";
import { FloatingInput } from "../components/FloatingInput";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TodoList from "../components/TodoList";
import { useGetFoldersQuery } from "../queries/folderqueries";
import { FolderContext } from "../context/folderContext";

const Home = () => {
  const { data: folderData } = useGetFoldersQuery();
  const { activeFolderId } = useContext(FolderContext);
  console.log(activeFolderId);
  return (
    <div className="flex">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1 mt-8">
        <div className="text-center py-4 text-xl">
          {folderData && activeFolderId &&
            folderData.find(
              (elem: { id: string; name: string }) => elem.id == activeFolderId
            ).name}
        </div>
        {/* <Navbar activeHref="/" /> */}
        <div className="mx-4 px-2 py-1 flex justify-center">
          <TodoList />
          <FloatingInput />
        </div>
      </div>
    </div>
  );
};

export default Home;
