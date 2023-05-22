import { useRef } from "react";
import { Link } from "react-router-dom";
import { FaAlignJustify } from "react-icons/fa";

import classes from "./Header.module.css";
import Navigation from "./Navigation";

const Header = () => {
  const menuRef = useRef();

  const toggleMenuHandler = () => {
    menuRef.current.classList.toggle(classes["toggle-nav"]);
  };

  const navClasses = `${classes["nav-container"]} ${classes["toggle-nav"]}`;

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to="/accounts">Social Warlock</Link>
      </div>
      <FaAlignJustify
        className={classes["menu-icon"]}
        onClick={toggleMenuHandler}
      />
      <nav className={navClasses} ref={menuRef}>
        <Navigation />
      </nav>
    </header>
  );
};

export default Header;
