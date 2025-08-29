import PillNav from "../blocks/Components/PillNav/PillNav";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import book from "../assets/book.svg";

const Home = () => {
  return (
    <div className="flex">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1">
        <nav className="w-full flex justify-center">
          <PillNav
            logo={book}
            logoAlt="Company Logo"
            items={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" },
            ]}
            activeHref="/"
            ease="power2.easeOut"
            baseColor="#000000"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
            className=""
          />
        </nav>
        {/* <Navbar /> */}
      </div>
    </div>
  );
};

export default Home;
