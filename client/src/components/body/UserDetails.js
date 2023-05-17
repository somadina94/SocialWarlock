import { useSelector } from "react-redux";

import classes from "./UserDetails.module.css";

const UserDetails = () => {
  const user = useSelector((state) => state.auth.user);
  const name = user.name;
  const email = user.email;
  return (
    <div className={classes.info}>
      <div className={classes.details}>
        <span>Name</span>
        <span>{name}</span>
      </div>
      <div className={classes.details}>
        <span>Email</span>
        <span>{email}</span>
      </div>
    </div>
  );
};

export default UserDetails;
