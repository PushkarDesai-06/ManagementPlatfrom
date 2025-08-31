import PillNav from "../blocks/Components/PillNav/PillNav";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div className="flex">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Navbar activeHref="/" />
      </div>
    </div>
  );
};

export default Home;
