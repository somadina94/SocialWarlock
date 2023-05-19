import Cookies from "universal-cookie";
import { useLoaderData } from "react-router-dom";

import Account from "./Account";
import classes from "./Accounts.module.css";
import { getAllUsers } from "../../api/api";

const Accounts = () => {
  const res = useLoaderData();
  const users = res.data.users;

  return (
    <section className={classes.accounts}>
      {users.map((el) => (
        <Account
          key={el._id}
          id={el._id}
          name={el.name}
          email={el.email}
          createdAt={el.createdAt}
          active={el.active}
        />
      ))}
    </section>
  );
};

export default Accounts;

export const loader = () => {
  const cookie = new Cookies();
  const jwt = cookie.get("jwt");
  return getAllUsers(jwt);
};
