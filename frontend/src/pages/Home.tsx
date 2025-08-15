import { Link } from "react-router";

const Home = () => {
  return (
    <nav
      className="
    h-16 w-full flex bg-neutral-100 justify-center"
    >
      <div>
        <Link to={"/signup"}>Home</Link>
      </div>
    </nav>
  );
};

export default Home;
