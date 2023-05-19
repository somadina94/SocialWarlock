import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import classes from "./Product.module.css";
import Spinner from "../UI/Spinner";
import { deleteProduct } from "../../api/api";
import { approveProduct } from "../../api/api";
import { alertActions } from "../../store/alert-slice";

const Product = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);
  const { jwt } = useCookies(["jwt"])[0];
  const {
    name,
    id,
    username,
    password,
    recoveryEmail,
    recoveryPassword,
    active,
    status,
  } = props;

  const date = new Date(props.date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const approveHandler = async () => {
    setShowSpinner(true);

    const res = await approveProduct(jwt, id);

    if (res.status === "success") {
      dispatch(
        alertActions.setState({
          message: "Product deleted successfully.",
          status: "success",
        })
      );
      navigate("/products", { replace: true });
    } else {
      dispatch(
        alertActions.setState({ message: res.message, status: "error" })
      );
    }

    setShowSpinner(false);
  };
  const deleteHandler = async () => {
    setShowSpinner(true);

    const res = await deleteProduct(jwt, id);

    if (!res) {
      dispatch(
        alertActions.setState({ message: res.message, status: res.status })
      );
      window.location.reload();
    } else {
      dispatch(
        alertActions.setState({ message: res.message, status: "error" })
      );
    }

    setShowSpinner(false);
  };

  const marketStatus = active ? "In store" : "sold";
  return (
    <div className={classes.product}>
      {showSpinner && <Spinner />}
      <div className={classes.details}>
        <span>Market status</span>
        <span>{marketStatus}</span>
      </div>
      <div className={classes.details}>
        <span>ID</span>
        <span>{id}</span>
      </div>
      <div className={classes.details}>
        <span>Name</span>
        <span>{name}</span>
      </div>
      <div className={classes.details}>
        <span>Username</span>
        <span>{username}</span>
      </div>
      <div className={classes.details}>
        <span>Password</span>
        <span>{password}</span>
      </div>
      <div className={classes.details}>
        <span>Recovery email</span>
        <span>{recoveryEmail}</span>
      </div>
      <div className={classes.details}>
        <span>Recovery password</span>
        <span>{recoveryPassword}</span>
      </div>
      <div className={classes.details}>
        <span>Date created</span>
        <span>{date}</span>
      </div>
      <div className={classes.action}>
        <button
          type="button"
          className={classes.approve}
          onClick={approveHandler}
          disabled={status}
        >
          Approve
        </button>
        <button
          type="button"
          className={classes.delete}
          disabled={active}
          onClick={deleteHandler}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Product;
