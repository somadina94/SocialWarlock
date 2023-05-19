import { useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useInput from "../../hooks/userInput";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  BsFillEnvelopeAtFill,
  BsKeyFill,
  BsEyeFill,
  BsEyeSlashFill,
} from "react-icons/bs";

import classes from "./Login.module.css";
import { logIn } from "../../api/api";
import { authActions } from "../../store/auth-slice";
import { alertActions } from "../../store/alert-slice";
import Spinner from "../UI/Spinner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [showSpinner, setShowSpinner] = useState(false);
  const dispatch = useDispatch();
  const setCookie = useCookies(["jwt"])[1];
  const navigate = useNavigate();

  const {
    value: emailInput,
    enteredValueIsValid: emailInputIsValid,
    hasError: emailInputIsInvalid,
    valueInputChangedHandler: emailInputChangedHandler,
    valueInputBlurHandler: emailInputBlurHandler,
    reset: emailInputReset,
  } = useInput((value) => value.trim().includes("@"));

  const {
    value: passwordInput,
    enteredValueIsValid: passwordInputIsValid,
    hasError: passwordInputIsInvalid,
    valueInputChangedHandler: passwordInputChangedHandler,
    valueInputBlurHandler: passwordInputBlurHandler,
    reset: passwordInputReset,
  } = useInput((value) => value.trim() !== "");

  const switchEyeIcon = () => {
    setShowPassword((initialstate) => !initialstate);
  };

  const switchType = (val) => {
    setPasswordType(val);
  };

  const passwordActionSee = () => {
    switchEyeIcon();
    switchType("text");
  };
  const passwordActioBlind = () => {
    switchEyeIcon();
    switchType("password");
  };

  let formIsValid = false;

  if (emailInputIsValid && passwordInputIsValid) {
    formIsValid = true;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowSpinner(true);

    const loginData = {
      email: emailInput,
      password: passwordInput,
    };

    const res = await logIn(loginData);

    if (res.status === "success") {
      dispatch(authActions.login({ user: res.data.user }));
      dispatch(
        alertActions.setState({ message: res.message, status: res.status })
      );
      setCookie("jwt", res.token);
      navigate("/platforms", { replace: true });
    } else {
      dispatch(
        alertActions.setState({ message: res.message, status: "error" })
      );
    }

    setShowSpinner(false);
    passwordInputReset();
    emailInputReset();
  };

  const emailInputClasses = emailInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const passwordInputClasses = passwordInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;
  return (
    <Fragment>
      <form className={classes.form} onSubmit={submitHandler}>
        {showSpinner && <Spinner />}
        <div className={emailInputClasses}>
          <label htmlFor="email">Email address</label>
          <div className={classes["input-group"]}>
            <BsFillEnvelopeAtFill className={classes.icon} />
            <input
              type="email"
              value={emailInput}
              onChange={emailInputChangedHandler}
              onBlur={emailInputBlurHandler}
            />
          </div>
        </div>
        <div className={passwordInputClasses}>
          <label htmlFor="password">Password</label>
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
                onClick={passwordActioBlind}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
          <Link to="/forgotPassword">Forgot password?</Link>
        </div>
        <div className={classes.action}>
          <button type="submit" disabled={!formIsValid}>
            Login
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default Login;
