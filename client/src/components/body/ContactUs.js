import { Fragment, useRef, useState } from "react";
import {
  BsFillPersonFill,
  BsFillEnvelopeAtFill,
  BsEnvelopeFill,
} from "react-icons/bs";
import useInput from "../../hooks/userInput";
import emailjs from "@emailjs/browser";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";

import classes from "./ContactUs.module.css";
import Spinner from "../UI/Spinner";
import { alertActions } from "../../store/alert-slice";

const ContactUs = () => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const [showSpinner, setShowSpinner] = useState(false);
  const {
    value: nameInput,
    enteredValueIsValid: nameInputIsValid,
    hasError: nameInputIsInvalid,
    valueInputChangedHandler: nameInputChangedHandler,
    valueInputBlurHandler: nameInputBlurHandler,
    reset: nameInputReset,
  } = useInput((value) => value.trim() !== "");

  const {
    value: emailInput,
    enteredValueIsValid: emailInputIsValid,
    hasError: emailInputIsInvalid,
    valueInputChangedHandler: emailInputChangedHandler,
    valueInputBlurHandler: emailInputBlurHandler,
    reset: emailInputReset,
  } = useInput((value) => value.trim().includes("@"));

  const {
    value: messageInput,
    enteredValueIsValid: messageInputIsValid,
    hasError: messageInputIsInvalid,
    valueInputChangedHandler: messageInputChangedHandler,
    valueInputBlurHandler: messageInputBlurHandler,
    reset: messageInputReset,
  } = useInput((value) => value.trim() !== "");

  let formIsValid = false;

  if (emailInputIsValid && nameInputIsValid && messageInputIsValid) {
    formIsValid = true;
  }

  const sendEmailHandler = (e) => {
    e.preventDefault();
    setShowSpinner(true);

    emailjs
      .sendForm(
        "service_ua44fo2",
        "template_woqbj77",
        formRef.current,
        "ljDiiwdlHrRgfP4dr"
      )
      .then(
        (result) => {
          dispatch(
            alertActions.setState({
              message:
                "Email sent succssfully! We will get back to you as soon as possible.",
              status: "success",
            })
          );
          e.target.reset();
          setShowSpinner(false);
          nameInputReset();
          emailInputReset();
          messageInputReset();
        },
        (error) => {
          dispatch(
            alertActions.setState({
              message:
                "There was an error sending your email, please try again later or copy our email and email us direct from your mailbox",
              status: "error",
            })
          );
          setShowSpinner(false);
        }
      );
  };

  const nameInputClasses = nameInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const emailInputClasses = emailInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const messageInputClasses = messageInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  return (
    <Fragment>
      <Helmet>
        <title>Contact Us</title>
        <meta
          name="description"
          content="Contact us through our contact channels provided for support and enquiries."
        />
        <link rel="canonical" href="/contact-us" />
      </Helmet>
      <form className={classes.form} ref={formRef} onSubmit={sendEmailHandler}>
        {showSpinner && <Spinner />}
        <div className={nameInputClasses}>
          <label htmlFor="name">Name</label>
          <div className={classes["input-group"]}>
            <BsFillPersonFill className={classes.icon} />
            <input
              type="text"
              name="name"
              value={nameInput}
              onChange={nameInputChangedHandler}
              onBlur={nameInputBlurHandler}
            />
          </div>
          {nameInputIsInvalid && <span>Please enter your name.</span>}
        </div>
        <div className={emailInputClasses}>
          <label htmlFor="email">Emaill address</label>
          <div className={classes["input-group"]}>
            <BsFillEnvelopeAtFill className={classes.icon} />
            <input
              type="text"
              name="email"
              value={emailInput}
              onChange={emailInputChangedHandler}
              onBlur={emailInputBlurHandler}
            />
          </div>
          {emailInputIsInvalid && <span>Please enter your valid email.</span>}
        </div>
        <div className={messageInputClasses}>
          <label htmlFor="message">Message</label>
          <div className={classes["input-group"]}>
            <BsEnvelopeFill
              className={classes.icon}
              style={{ alignSelf: "flex-start" }}
            />
            <textarea
              type="text"
              name="message"
              value={messageInput}
              onChange={messageInputChangedHandler}
              onBlur={messageInputBlurHandler}
            />
          </div>
          {messageInputIsInvalid && <span>Message field cannot be empty.</span>}
        </div>
        <div className={classes.action}>
          <button type="submit" disabled={!formIsValid}>
            Send email
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default ContactUs;
