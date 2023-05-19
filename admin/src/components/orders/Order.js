import { useState } from "react";
import { BsForwardFill } from "react-icons/bs";
import { GiAries } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";

import classes from "./Order.module.css";
import { approveOrder } from "../../api/api";
import { deleteOrder } from "../../api/api";
import { alertActions } from "../../store/alert-slice";
import Spinner from "../UI/Spinner";

const Order = (props) => {
  const [showSpinner, setShowSpinner] = useState();
  const { jwt } = useCookies(["jwt"])[0];
  const dispatch = useDispatch();
  const { id, totalQuantity, totalPrice } = props;

  const status = props.status === true ? "Delivered" : "Processing";

  const date = new Date(props.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const approveHandler = async () => {
    setShowSpinner(true);

    const res = await approveOrder(jwt, id);

    if (res.status === "success") {
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

  const deleteHandler = async () => {
    setShowSpinner(true);

    const res = await deleteOrder(jwt, id);

    if (!res) {
      dispatch(
        alertActions.setState({
          message: "Order deleted successfully.",
          status: "success",
        })
      );
      window.location.reload();
    } else {
      dispatch(
        alertActions.setState({ message: res.message, status: "error" })
      );
    }

    setShowSpinner(false);
  };

  return (
    <div className={classes.order}>
      {showSpinner && <Spinner />}
      <div className={classes["icon-container"]}>
        <GiAries className={classes.icon} />
      </div>
      <div className={classes.details}>
        <span>Order code</span>
        <span>
          <BsForwardFill className={classes.arrow} />
        </span>
        <p className={classes.paragraph}>{id}</p>
      </div>
      <div className={classes.details}>
        <span>Total quantity</span>
        <BsForwardFill className={classes.arrow} />
        <span>{totalQuantity}</span>
      </div>
      <div className={classes.details}>
        <span>Total price</span>
        <BsForwardFill className={classes.arrow} />
        <span>${totalPrice}</span>
      </div>
      <div className={classes.details}>
        <span>Status</span>
        <BsForwardFill className={classes.arrow} />
        <span>{status}</span>
      </div>
      <div className={classes.details}>
        <span>Created at</span>
        <BsForwardFill className={classes.arrow} />
        <p className={classes.paragraph}>{date}</p>
      </div>
      <div className={classes["cart-action"]}>
        <Link to={`/orders/${id}`}>View details</Link>
        <button
          type="button"
          className={classes.approve}
          onClick={approveHandler}
        >
          Approve
        </button>
        <button
          type="button"
          className={classes.reject}
          onClick={deleteHandler}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Order;
