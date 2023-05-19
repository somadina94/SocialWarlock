import { useState } from "react";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";

import classes from "./Account.module.css";
import { blockUser, unblockUser } from "../../api/api";
import { alertActions } from "../../store/alert-slice";
import Spinner from "../UI/Spinner";

const Account = (props) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const { name, email, createdAt, active, id } = props;
  const dispatch = useDispatch();
  const { jwt } = useCookies(["jwt"])[0];

  const date = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const status = active ? "active" : "blocked";

  const blockUserHandler = async () => {
    setShowSpinner(true);
    const res = await blockUser(jwt, id);
    if (res.status === "success") {
      dispatch(
        alertActions.setState({ message: res.message, status: res.status })
      );
    } else {
      dispatch(
        alertActions.setState({ message: res.message, status: "error" })
      );
    }
    setShowSpinner(false);
    window.location.reload();
  };
  const unblockUserHandler = async () => {
    setShowSpinner(true);
    const res = await unblockUser(jwt, id);
    if (res.status === "success") {
      dispatch(
        alertActions.setState({ message: res.message, status: res.status })
      );
    } else {
      dispatch(
        alertActions.setState({ message: res.message, status: "error" })
      );
    }
    setShowSpinner(true);
    window.location.reload();
  };

  return (
    <div className={classes.account}>
      {showSpinner && <Spinner />}
      <div className={classes.info}>
        <span>Name</span>
        <span>{name}</span>
      </div>
      <div className={classes.info}>
        <span>Email address</span>
        <span>{email}</span>
      </div>
      <div className={classes.info}>
        <span>Date joined</span>
        <span>{date}</span>
      </div>
      <div className={classes.info}>
        <span>Status</span>
        <span>{status}</span>
      </div>
      <div className={classes.action}>
        <button
          type="button"
          className={classes.block}
          onClick={blockUserHandler}
        >
          Block
        </button>
        <button
          type="button"
          className={classes.unblock}
          onClick={unblockUserHandler}
          disabled={active}
        >
          Unblock
        </button>
      </div>
    </div>
  );
};

export default Account;
