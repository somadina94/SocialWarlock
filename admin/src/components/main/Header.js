import { useRef } from "react";
// import { BsCart } from "react-icons/bs";
import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
import { FaAlignJustify } from "react-icons/fa";

import classes from "./Header.module.css";
import Navigation from "./Navigation";
// import { cartActions } from "../../store/cart-slice";

const Header = () => {
  // const btnRef = useRef();
  const menuRef = useRef();
  // const dispatch = useDispatch();
  // const cartQuantity = useSelector((state) => state.cart.totalQuantity);

  // const showCartHandler = () => {
  //   dispatch(cartActions.showCart());
  // };

  // const btnOutHoverEffect = () => {
  //   btnRef.current.classList.add(classes["hover-out"]);
  //   btnRef.current.classList.remove(classes["hover-in"]);
  // };
  // const btnInHoverEffect = () => {
  //   btnRef.current.classList.add(classes["hover-in"]);
  //   btnRef.current.classList.remove(classes["hover-out"]);
  // };

  const toggleMenuHandler = () => {
    menuRef.current.classList.toggle(classes["toggle-nav"]);
  };

  const navClasses = `${classes["nav-container"]} ${classes["toggle-nav"]}`;

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to="/">Social Warlock</Link>
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
