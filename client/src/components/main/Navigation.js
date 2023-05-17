import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";

import classes from "./Navigation.module.css";
import { logOut } from "../../api/api";
import { authActions } from "../../store/auth-slice";

const Navigation = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const setCookie = useCookies(["jwt"])[1];
  const dispatch = useDispatch();

  const logoutHandler = () => {
    const res = logOut();
    setCookie("jwt", res.token);
    dispatch(authActions.logout());
  };

  return (
    <ul className={classes.nav}>
      <li>
        <NavLink
          to="/products"
          className={(navData) => (navData.isActive ? classes.active : "")}
        >
          Products
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact-us"
          className={(navData) => (navData.isActive ? classes.active : "")}
        >
          Contact Us
        </NavLink>
      </li>
      {!isLoggedIn && (
        <li>
          <NavLink
            to="/create-account"
            className={(navData) => (navData.isActive ? classes.active : "")}
          >
            Create Account
          </NavLink>
        </li>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink
            to="/Login"
            className={(navData) => (navData.isActive ? classes.active : "")}
          >
            Login
          </NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink
            to="/dashboard"
            className={(navData) => (navData.isActive ? classes.active : "")}
          >
            My account
          </NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink
            to="/Login"
            className={(navData) => (navData.isActive ? classes.active : "")}
            onClick={logoutHandler}
          >
            Logout
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default Navigation;
