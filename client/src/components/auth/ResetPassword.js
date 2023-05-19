import { useState } from "react";
import { useDispatch } from "react-redux";
import useInput from "../../hooks/userInput";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { BsKeyFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

import classes from "./ForgotPassword.module.css";
import { alertActions } from "../../store/alert-slice";
import Spinner from "../UI/Spinner";
import { resetPassword } from "../../api/api";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setconfirmPasswordType] = useState("password");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setCookie = useCookies(["jwt"])[1];
  const [showSpinner, setShowSpinner] = useState(false);
  const params = useParams();

  const {
    value: passwordInput,
    enteredValueIsValid: passwordInputIsValid,
    hasError: passwordInputIsInvalid,
    valueInputChangedHandler: passwordInputChangedHandler,
    valueInputBlurHandler: passwordInputBlurHandler,
    reset: passwordInputReset,
  } = useInput((value) => value.trim() !== "");
  const {
    value: confirmPasswordInput,
    enteredValueIsValid: confirmPasswordInputIsValid,
    hasError: confirmPasswordInputIsInvalid,
    valueInputChangedHandler: confirmPasswordInputChangedHandler,
    valueInputBlurHandler: confirmPasswordInputBlurHandler,
    reset: confirmPasswordInputReset,
  } = useInput((value) => value.trim() !== "");

  let formIsValid = false;
  if (passwordInputIsValid && confirmPasswordInputIsValid) {
    formIsValid = true;
  }

  const switchEyeIcon = () => {
    setShowPassword((initialstate) => !initialstate);
  };

  const switchEyeIcon2 = () => {
    setShowConfirmPassword((initialstate) => !initialstate);
  };

  const switchType = (val) => {
    setPasswordType(val);
  };

  const switchType2 = (val) => {
    setconfirmPasswordType(val);
  };

  const passwordActionSee = () => {
    switchEyeIcon();
    switchType("text");
  };

  const passwordActionSee2 = () => {
    switchEyeIcon2();
    switchType2("text");
  };
  const passwordActionBlind = () => {
    switchEyeIcon();
    switchType("password");
  };

  const passwordActionBlind2 = () => {
    switchEyeIcon2();
    switchType2("password");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowSpinner(true);

    const data = {
      password: passwordInput,
      passwordConfirm: confirmPasswordInput,
    };

    const res = await resetPassword(data, params.token);

    if (res.status === "success") {
      setCookie("jwt", res.token);
      dispatch(
        alertActions.setState({ message: res.message, status: res.status })
      );
      navigate("/", { replace: true });
    } else {
      dispatch(
        alertActions.setState({ message: res.message, status: "error" })
      );
    }

    setShowSpinner(false);

    passwordInputReset();
    confirmPasswordInputReset();
  };

  const passwordInputClasses = passwordInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const confirmPasswordInputClasses = confirmPasswordInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {showSpinner && <Spinner />}
      <h2>Enter your new password and click proceed.</h2>
      <div className={passwordInputClasses}>
        <label>New password</label>
        <div className={classes["input-group"]}>
          <BsKeyFill className={classes.icon} />
          <input
            type={passwordType}
            value={passwordInput}
            onChange={passwordInputChangedHandler}
            onBlur={passwordInputBlurHandler}
          />
          {!showPassword && (
            <BsEyeFill
              className={classes.icon}
              onClick={passwordActionSee}
              style={{ cursor: "pointer" }}
            />
          )}
          {showPassword && (
            <BsEyeSlashFill
              className={classes.icon}
              onClick={passwordActionBlind}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
      </div>
      <div className={confirmPasswordInputClasses}>
        <label>Confirm new password</label>
        <div className={classes["input-group"]}>
          <BsKeyFill className={classes.icon} />
          <input
            type={confirmPasswordType}
            value={confirmPasswordInput}
            onChange={confirmPasswordInputChangedHandler}
            onBlur={confirmPasswordInputBlurHandler}
          />
          {!showConfirmPassword && (
            <BsEyeFill
              className={classes.icon}
              onClick={passwordActionSee2}
              style={{ cursor: "pointer" }}
            />
          )}
          {showConfirmPassword && (
            <BsEyeSlashFill
              className={classes.icon}
              onClick={passwordActionBlind2}
              style={{ cursor: "pointer" }}
            />
          )}
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

export default ResetPassword;
