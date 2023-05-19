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
      {isLoggedIn && (
        <li>
          <NavLink
            to="/accounts"
            className={(navData) => (navData.isActive ? classes.active : "")}
          >
            Accounts
          </NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink
            to="/platforms"
            className={(navData) => (navData.isActive ? classes.active : "")}
          >
            Platforms
          </NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink
            to="/orders"
            className={(navData) => (navData.isActive ? classes.active : "")}
          >
            Orders
          </NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink
            to="/products"
            className={(navData) => (navData.isActive ? classes.active : "")}
          >
            Products
          </NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink
            to="/create-platform"
            className={(navData) => (navData.isActive ? classes.active : "")}
          >
            Create platform
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
