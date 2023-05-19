import { useState } from "react";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import useInput from "../../hooks/userInput";
import { useNavigate } from "react-router-dom";
import { FcCurrencyExchange, FcGlobe } from "react-icons/fc";

import classes from "./CreatePlatform.module.css";
import { createPlatform } from "../../api/api";
import { alertActions } from "../../store/alert-slice";
import Spinner from "../UI/Spinner";

const CreatePlatform = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const dispatch = useDispatch();
  const { jwt } = useCookies(["jwt"])[0];
  const navigate = useNavigate();

  const {
    value: nameInput,
    enteredValueIsValid: nameInputIsValid,
    hasError: nameInputIsInvalid,
    valueInputChangedHandler: nameInputChangedHandler,
    valueInputBlurHandler: nameInputBlurHandler,
    reset: nameInputReset,
  } = useInput((value) => value.trim() !== "");

  const {
    value: priceInput,
    enteredValueIsValid: priceInputIsValid,
    hasError: priceInputIsInvalid,
    valueInputChangedHandler: priceInputChangedHandler,
    valueInputBlurHandler: priceInputBlurHandler,
    reset: priceInputReset,
  } = useInput((value) => value.trim() !== "");

  let formIsValid = false;
  if (nameInputIsValid && priceInputIsValid) {
    formIsValid = true;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowSpinner(true);

    const data = {
      name: nameInput,
      price: priceInput,
    };

    const res = await createPlatform(jwt, data);

    if (res.status === "success") {
      dispatch(
        alertActions.setState({ message: res.message, status: res.status })
      );
      navigate("/platforms");
    } else {
      dispatch(
        alertActions.setState({ message: res.message, status: "error" })
      );
    }

    setShowSpinner(false);
    nameInputReset();
    priceInputReset();
  };

  const nameInputClasses = nameInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const priceInputClasses = priceInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {showSpinner && <Spinner />}
      <div className={nameInputClasses}>
        <label>Name</label>
        <div className={classes["input-group"]}>
          <FcGlobe className={classes.icon} />
          <input
            type="text"
            value={nameInput}
            onChange={nameInputChangedHandler}
            onBlur={nameInputBlurHandler}
          />
        </div>
      </div>
      <div className={priceInputClasses}>
        <label>Price</label>
        <div className={classes["input-group"]}>
          <FcCurrencyExchange className={classes.icon} />
          <input
            type="number"
            value={priceInput}
            onChange={priceInputChangedHandler}
            onBlur={priceInputBlurHandler}
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

export default CreatePlatform;
