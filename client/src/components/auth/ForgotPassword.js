import { useState } from "react";
import { useDispatch } from "react-redux";
import useInput from "../../hooks/userInput";
import { BsFillEnvelopeAtFill } from "react-icons/bs";

import classes from "./ForgotPassword.module.css";
import { alertActions } from "../../store/alert-slice";
import Spinner from "../UI/Spinner";
import { forgotPassword } from "../../api/api";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);

  const {
    value: emailInput,
    enteredValueIsValid: emailInputIsValid,
    hasError: emailInputIsInvalid,
    valueInputChangedHandler: emailInputChangedHandler,
    valueInputBlurHandler: emailInputBlurHandler,
    reset: emailInputReset,
  } = useInput((value) => value.trim().includes("@"));

  let formIsValid = false;
  if (emailInputIsValid) {
    formIsValid = true;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowSpinner(true);

    const res = await forgotPassword({ email: emailInput });

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

    emailInputReset();
  };

  const emailInputClasses = emailInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {showSpinner && <Spinner />}
      <h2>Enter your emaill address and click proceed</h2>
      <div className={emailInputClasses}>
        <label>Email address</label>
        <div className={classes["input-group"]}>
          <BsFillEnvelopeAtFill className={classes.icon} />
          <input
            type="email"
            value={emailInput}
            onChange={emailInputChangedHandler}
            onBlur={emailInputBlurHandler}
          />
          {emailInputIsInvalid && <span>Please enter a valid email.</span>}
        </div>
      </div>
      <div className={classes.action}>
        <button type="submit" disabled={!formIsValid}>
          Proceed
        </button>
      </div>
    </form>
  );
};

export default ForgotPassword;
