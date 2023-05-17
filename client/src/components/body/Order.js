import { BsBagCheck, BsForwardFill } from "react-icons/bs";

import classes from "./Order.module.css";
import { Link } from "react-router-dom";

const Order = (props) => {
  const { id, totalQuantity, totalPrice } = props;

  const date = new Date(props.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className={classes.order}>
      <div className={classes["icon-container"]}>
        <BsBagCheck className={classes.icon} />
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
        <span>Created at</span>
        <BsForwardFill className={classes.arrow} />
        <p className={classes.paragraph}>{date}</p>
      </div>
      <div className={classes["cart-action"]}>
        <Link to={`${id}`}>View details</Link>
      </div>
    </div>
  );
};

export default Order;
