import { Fragment } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";

import classes from "./AlertModal.module.css";
import styles from "../UI/General.module.css";
import Backdrop from "./Spinner";
import { alertActions } from "../../store/alert-slice";

const Overlay = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.alert.message);
  const status = useSelector((state) => state.alert.status);
  const showModal = useSelector((state) => state.alert.showModal);

  const closeModalHandler = () => {
    dispatch(alertActions.resetState());
  };

  const response = status === "success" ? classes.success : classes.error;

  const responseClasses = showModal ? styles.add : styles.remove;

  return (
    <div className={`${responseClasses} ${response}`}>
      <h2>{message}</h2>
      <button className={classes.close} onClick={closeModalHandler}>
        X
      </button>
    </div>
  );
};

const AlertModal = () => {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");
  return (
    <Fragment>
      {ReactDOM.createPortal(<Backdrop />, backdropRoot)}
      {ReactDOM.createPortal(<Overlay />, overlayRoot)}
    </Fragment>
  );
};

export default AlertModal;
