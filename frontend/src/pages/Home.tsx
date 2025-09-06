import PillNav from "../blocks/Components/PillNav/PillNav";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Todo from "../components/Todo";
import TodoList from "../components/TodoList";

const Home = () => {
  return (
    <div className="flex">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Navbar activeHref="/" />
        <div className="mx-4 px-2 py-1 flex justify-center">
          <TodoList />
        </div>
      </div>
    </div>
  );
};

export default Home;
