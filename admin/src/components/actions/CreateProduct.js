import { useState } from "react";
import useInput from "../../hooks/userInput";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import Cookies from "universal-cookie";
import { useLoaderData } from "react-router-dom";
import { FcAddressBook, FcKey } from "react-icons/fc";

import classes from "./UpdatePlatform.module.css";
import { alertActions } from "../../store/alert-slice";
import Spinner from "../UI/Spinner";
import { getOnePlatform } from "../../api/api";
import { createProduct } from "../../api/api";

const CreateProduct = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const { jwt } = useCookies(["jwt"])[0];
  const dispatch = useDispatch();
  const res = useLoaderData();
  const platform = res.data.platform;
  const { name, _id: id } = platform;

  const {
    value: usernameInput,
    enteredValueIsValid: usernameInputIsValid,
    hasError: usernameInputIsInvalid,
    valueInputChangedHandler: usernameInputChangedHandler,
    valueInputBlurHandler: usernameInputBlurHandler,
    reset: usernameInputReset,
  } = useInput((value) => value.trim() !== "");

  const {
    value: passwordInput,
    enteredValueIsValid: passwordInputIsValid,
    hasError: passwordInputIsInvalid,
    valueInputChangedHandler: passwordInputChangedHandler,
    valueInputBlurHandler: passwordInputBlurHandler,
    reset: passwordInputReset,
  } = useInput((value) => value.trim() !== "");

  const {
    value: recoveryEmailInput,
    enteredValueIsValid: recoveryEmailInputIsValid,
    hasError: recoveryEmailInputIsInvalid,
    valueInputChangedHandler: recoveryEmailInputChangedHandler,
    valueInputBlurHandler: recoveryEmailInputBlurHandler,
    reset: recoveryEmailInputReset,
  } = useInput((value) => value.trim() !== "");

  const {
    value: recoveryPasswordInput,
    enteredValueIsValid: recoveryPasswordInputIsValid,
    hasError: recoveryPasswordInputIsInvalid,
    valueInputChangedHandler: recoveryPasswordInputChangedHandler,
    valueInputBlurHandler: recoveryPasswordInputBlurHandler,
    reset: recoveryPasswordInputReset,
  } = useInput((value) => value.trim() !== "");

  let formIsValid = false;

  if (
    usernameInputIsValid &&
    passwordInputIsValid &&
    recoveryEmailInputIsValid &&
    recoveryPasswordInputIsValid
  ) {
    formIsValid = true;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowSpinner(true);

    const data = {
      name,
      platform: id,
      username: usernameInput,
      password: passwordInput,
      recoveryEmail: recoveryEmailInput,
      recoveryPassword: recoveryPasswordInput,
    };

    const res = await createProduct(jwt, data);

    if (res.status === "success") {
      dispatch(
        alertActions.setState({ message: res.message, status: res.status })
      );
    } else {
      dispatch(
        alertActions.setState({ message: res.message, status: "error" })
      );
    }

    usernameInputReset();
    passwordInputReset();
    recoveryEmailInputReset();
    recoveryPasswordInputReset();
    setShowSpinner(false);
  };

  const usernameInputClasses = usernameInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const passwordInputClasses = passwordInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const recoveryEmailInputClasses = recoveryEmailInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const recoveryPasswordInputClasses = recoveryPasswordInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {showSpinner && <Spinner />}
      <h1 style={{ textAlign: "center" }}>{name}</h1>
      <div className={usernameInputClasses}>
        <label>Username</label>
        <div className={classes["input-group"]}>
          <FcAddressBook className={classes.icon} />
          <input
            type="text"
            value={usernameInput}
            onChange={usernameInputChangedHandler}
            onBlur={usernameInputBlurHandler}
          />
        </div>
      </div>
      <div className={passwordInputClasses}>
        <label>Password</label>
        <div className={classes["input-group"]}>
          <FcKey className={classes.icon} />
          <input
            type="text"
            value={passwordInput}
            onChange={passwordInputChangedHandler}
            onBlur={passwordInputBlurHandler}
          />
        </div>
      </div>
      <div className={recoveryEmailInputClasses}>
        <label>Recovery Email</label>
        <div className={classes["input-group"]}>
          <FcAddressBook className={classes.icon} />
          <input
            type="text"
            value={recoveryEmailInput}
            onChange={recoveryEmailInputChangedHandler}
            onBlur={recoveryEmailInputBlurHandler}
          />
        </div>
      </div>
      <div className={recoveryPasswordInputClasses}>
        <label>Recovery Passowrd</label>
        <div className={classes["input-group"]}>
          <FcKey className={classes.icon} />
          <input
            type="text"
            value={recoveryPasswordInput}
            onChange={recoveryPasswordInputChangedHandler}
            onBlur={recoveryPasswordInputBlurHandler}
          />
        </div>
      </div>
      <div className={classes.action}>
        <button type="submit" disabled={!formIsValid}>
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateProduct;

export const loader = ({ params }) => {
  const { id } = params;
  const cookies = new Cookies();
  const jwt = cookies.get("jwt");
  return getOnePlatform(id, jwt);
};
