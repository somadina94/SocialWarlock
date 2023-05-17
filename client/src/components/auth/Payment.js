import { Fragment, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";

import classes from "./Payment.module.css";
import Backdrop from "../UI/Backdrop";
import { walletAddress } from "../config/Config";
import scanCode from "../../images/walletScanCode.jpg";
import { cartActions } from "../../store/cart-slice";
import styles from "../UI/General.module.css";
import { createOrder } from "../../api/api";
import { alertActions } from "../../store/alert-slice";
import Spinner from "../UI/Spinner";

const Overlay = () => {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const cart = useSelector((state) => state.cart.cart);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const showPayment = useSelector((state) => state.cart.showPayment);
  const checkRef = useRef();
  const [paid, setPaid] = useState(false);
  const { jwt } = useCookies(["jwt"])[0];

  const handleChange = (event) => {
    if (event.target.checked) {
      setPaid(true);
    } else {
      setPaid(false);
    }
  };

  const paymentHandler = async () => {
    setShowSpinner(true);
    const data = {
      totalPrice,
      totalQuantity,
      cart,
    };
    const res = await createOrder(jwt, data);

    if (res.status === "success") {
      dispatch(
        alertActions.setState({ message: res.message, status: res.status })
      );
    } else {
      dispatch(
        alertActions.setState({
          message: "Something went wrong, please contact customer support",
          status: "error",
        })
      );
    }

    dispatch(cartActions.hidePay());
    dispatch(cartActions.clearCart());
    setShowSpinner(false);
  };

  const payClasses = showPayment
    ? `${classes.pay} ${styles.add}`
    : `${classes.pay} ${styles.remove}`;

  return (
    <div className={payClasses}>
      {showSpinner && <Spinner />}
      <div className={classes.wallet}>
        <img src={scanCode} alt="address" />
      </div>
      <p className={classes["text-address"]}>{walletAddress}</p>
      <span className={classes.price}>${totalPrice}</span>
      <p className={classes.instruction}>
        Transfer eaxctly the above amount to the above wallet address and check
        the box below to proceed.
      </p>
      <div className={classes.done}>
        <span>Done</span>
        <input type="checkbox" ref={checkRef} onChange={handleChange} />
      </div>
      <button type="button" onClick={paymentHandler} disabled={!paid}>
        Proceed
      </button>
    </div>
  );
};

const Payment = () => {
  const backdropEl = document.getElementById("backdrop-root");
  const overlayEl = document.getElementById("overlay-root");

  return (
    <Fragment>
      {ReactDOM.createPortal(<Overlay />, overlayEl)}
      {ReactDOM.createPortal(<Backdrop />, backdropEl)}
    </Fragment>
  );
};

export default Payment;
