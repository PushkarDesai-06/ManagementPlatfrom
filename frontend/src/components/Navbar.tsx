import book from "../assets/book.svg";
import PillNav from "../blocks/Components/PillNav/PillNav";
import type { NavBarProps } from "../types/types";

const Navbar = ({ activeHref }: NavBarProps) => {
  return (
    <nav className="w-full flex justify-center mb-18">
      <PillNav
        logo={book}
        logoAlt="Company Logo"
        items={[
          { label: "Home", href: "/" },
          { label: "Profile", href: "/account" },
          { label: "Services", href: "/services" },
          { label: "Contact", href: "/contact" },
        ]}
        activeHref={activeHref}
        ease="power2.easeOut"
        baseColor="#eeeeee"
        pillColor="#111111"
        hoveredPillTextColor="#222222"
        pillTextColor="#ffffff"
        initialLoadAnimation={true}
      />
    </nav>
  );
};

export default Navbar;
