import { NavLink } from "react-router-dom";
import classes from "./UserNav.module.css";

const UserNav = () => {
  return (
    <ul className={`${classes.nav} ps-0`}>
      <li>
        <NavLink
          to="account-Info"
          className={(navData) =>
            navData.isActive ? classes.active : classes.inActive
          }
          role="button"
        >
          Account Info
        </NavLink>
      </li>
      <li>
        <NavLink
          to="orders"
          className={(navData) =>
            navData.isActive ? classes.active : classes.inActive
          }
        >
          Orders
        </NavLink>
      </li>
      <li>
        <NavLink
          to="updatePassword"
          className={(navData) =>
            navData.isActive ? classes.active : classes.inActive
          }
        >
          Change password
        </NavLink>
      </li>
    </ul>
  );
};

export default UserNav;
