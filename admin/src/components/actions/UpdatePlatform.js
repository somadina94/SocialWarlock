import { useState, useRef } from "react";
import useInput from "../../hooks/userInput";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import Cookies from "universal-cookie";
import { useLoaderData } from "react-router-dom";
import { FcCurrencyExchange, FcGlobe, FcChargeBattery } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

import classes from "./UpdatePlatform.module.css";
import { alertActions } from "../../store/alert-slice";
import Spinner from "../UI/Spinner";
import { getOnePlatform } from "../../api/api";
import { updatePlatform } from "../../api/api";

const UpdatePlatform = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const nameRef = useRef();
  const priceRef = useRef();
  const statusRef = useRef();
  const { jwt } = useCookies(["jwt"])[0];
  const dispatch = useDispatch();
  const res = useLoaderData();
  const navigate = useNavigate();
  const platform = res.data.platform;
  const { name, price } = platform;
  const status = platform.status === true ? "true" : "false";
  const {
    hasError: nameInputIsInvalid,
    valueInputChangedHandler: nameInputChangedHandler,
    valueInputBlurHandler: nameInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    enteredValueIsValid: priceInputIsValid,
    hasError: priceInputIsInvalid,
    valueInputChangedHandler: priceInputChangedHandler,
    valueInputBlurHandler: priceInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: statusInput,
    enteredValueIsValid: statusInputIsValid,
    hasError: statusInputIsInvalid,
    valueInputChangedHandler: statusInputChangedHandler,
    valueInputBlurHandler: statusInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  let formIsValid = false;

  if (priceInputIsValid && statusInputIsValid) {
    formIsValid = true;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowSpinner(true);

    const data = {
      name: nameRef.current.value,
      price: priceRef.current.value,
      status: statusRef.current.value,
    };

    const res = await updatePlatform(platform._id, data, jwt);

    if (res.status === "success") {
      dispatch(
        alertActions.setState({ message: res.message, status: res.status })
      );
      navigate("/platforms", { replace: true });
    } else {
      dispatch(
        alertActions.setState({ message: res.message, status: "error" })
      );
    }

    setShowSpinner(false);
  };

  const nameInputClasses = nameInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const priceInputClasses = priceInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const statusInputClasses = statusInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {showSpinner && <Spinner />}
      <div className={nameInputClasses}>
        <label>Platform name</label>
        <div className={classes["input-group"]}>
          <FcGlobe className={classes.icon} />
          <input
            type="text"
            ref={nameRef}
            value={name}
            onChange={nameInputChangedHandler}
            onBlur={nameInputBlurHandler}
            disabled
          />
        </div>
      </div>
      <div className={priceInputClasses}>
        <label>Platform price</label>
        <div className={classes["input-group"]}>
          <FcCurrencyExchange className={classes.icon} />
          <input
            type="text"
            ref={priceRef}
            value={price}
            onChange={priceInputChangedHandler}
            onBlur={priceInputBlurHandler}
          />
        </div>
      </div>
      <div className={statusInputClasses}>
        <label>Platform status</label>
        <div className={classes["input-group"]}>
          <FcChargeBattery className={classes.icon} />
          <select
            ref={statusRef}
            value={statusInput}
            onChange={statusInputChangedHandler}
            onBlur={statusInputBlurHandler}
          >
            <option>Current status = {status}</option>
            <option>true</option>
            <option>false</option>
          </select>
        </div>
      </div>
      <div className={classes.action}>
        <button type="submit" disabled={!formIsValid}>
          Update
        </button>
      </div>
    </form>
  );
};

export default UpdatePlatform;

export const loader = ({ params }) => {
  const { id } = params;
  const cookies = new Cookies();
  const jwt = cookies.get("jwt");
  return getOnePlatform(id, jwt);
};
