import { useState } from 'react';
import { BsKeyFill, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import useInput from '../../hooks/userInput';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { useSpring, animated } from 'react-spring';

import classes from './Password.module.css';
import { alertActions } from '../../store/alert-slice';
import { updatePassword } from '../../api/api';
import Spinner from '../UI/Spinner';

const Password = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const [showPassword2, setShowPassword2] = useState(false);
  const [passwordType2, setPasswordType2] = useState('password');
  const [showPassword3, setShowPassword3] = useState(false);
  const [passwordType3, setPasswordType3] = useState('password');
  const { jwt } = useCookies(['jwt'])[0];
  const [showSpinner, setShowSpinner] = useState(false);
  const dispatch = useDispatch();
  const animation = useSpring({
    marginTop: 0,
    opacity: 1,
    from: { marginTop: -50, opacity: 0 },
    config: { tension: 1000, friction: 10, duration: 1000 },
  });
  const {
    value: currentPasswordInput,
    enteredValueIsValid: currentPasswordInputIsValid,
    hasError: currentPasswordInputIsInvalid,
    valueInputChangedHandler: currentPasswordInputChangedHandler,
    valueInputBlurHandler: currentPasswordInputBlurHandler,
    reset: currentPasswordInputReset,
  } = useInput((value) => value.trim() !== '');

  const {
    value: passwordInput,
    enteredValueIsValid: passwordInputIsValid,
    hasError: passwordInputIsInvalid,
    valueInputChangedHandler: passwordInputChangedHandler,
    valueInputBlurHandler: passwordInputBlurHandler,
    reset: passwordInputReset,
  } = useInput((value) => value.trim() !== '');

  const {
    value: confirmPasswordInput,
    enteredValueIsValid: confirmPasswordInputIsValid,
    hasError: confirmPasswordInputIsInvalid,
    valueInputChangedHandler: confirmPasswordInputChangedHandler,
    valueInputBlurHandler: confirmPasswordInputBlurHandler,
    reset: confirmPasswordInputReset,
  } = useInput((value) => value.trim() !== '');

  let formIsValid = false;
  if (currentPasswordInputIsValid && passwordInputIsValid && confirmPasswordInputIsValid) {
    formIsValid = true;
  }

  const currentPasswordInputClasses = currentPasswordInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const passwordInputClasses = passwordInputIsInvalid ? `${classes.group} ${classes.invalid}` : classes.group;

  const confirmPasswordInputClasses = confirmPasswordInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const switchEyeIcon = () => {
    setShowPassword((initialstate) => !initialstate);
  };

  const switchType = (val) => {
    setPasswordType(val);
  };
  const switchEyeIcon2 = () => {
    setShowPassword2((initialstate) => !initialstate);
  };

  const switchType2 = (val) => {
    setPasswordType2(val);
  };
  const switchEyeIcon3 = () => {
    setShowPassword3((initialstate) => !initialstate);
  };

  const switchType3 = (val) => {
    setPasswordType3(val);
  };

  const passwordActionSee = () => {
    switchEyeIcon();
    switchType('text');
  };
  const passwordActioBlind = () => {
    switchEyeIcon();
    switchType('password');
  };

  const passwordActionSee2 = () => {
    switchEyeIcon2();
    switchType2('text');
  };
  const passwordActioBlind2 = () => {
    switchEyeIcon2();
    switchType2('password');
  };

  const passwordActionSee3 = () => {
    switchEyeIcon3();
    switchType3('text');
  };
  const passwordActioBlind3 = () => {
    switchEyeIcon3();
    switchType3('password');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowSpinner(true);

    const data = {
      passwordCurrent: currentPasswordInput,
      password: passwordInput,
      passwordConfirm: confirmPasswordInput,
    };

    const res = await updatePassword(jwt, data);

    if (res.status === 'success') {
      dispatch(alertActions.setState({ message: res.message, status: res.status }));
    } else {
      dispatch(alertActions.setState({ message: res.message, status: 'error' }));
    }

    setShowSpinner(false);
    currentPasswordInputReset();
    passwordInputReset();
    confirmPasswordInputReset();
    setTimeout(() => {
      dispatch(alertActions.resetState());
    }, 2000);
  };

  return (
    <animated.div style={animation}>
      <form className={classes.form} onSubmit={submitHandler}>
        {showSpinner && <Spinner />}
        <div className={currentPasswordInputClasses}>
          <label>Current password</label>
          <div className={classes['input-group']}>
            <BsKeyFill className={classes.icon} />
            <input
              type={passwordType}
              value={currentPasswordInput}
              onChange={currentPasswordInputChangedHandler}
              onBlur={currentPasswordInputBlurHandler}
            />
            {!showPassword && (
              <BsEyeFill className={classes.icon} onClick={passwordActionSee} style={{ cursor: 'pointer' }} />
            )}
            {showPassword && (
              <BsEyeSlashFill className={classes.icon} onClick={passwordActioBlind} style={{ cursor: 'pointer' }} />
            )}
          </div>
          {currentPasswordInputIsInvalid && <span>This field cannot be empty.</span>}
        </div>
        <div className={passwordInputClasses}>
          <label>New password</label>
          <div className={classes['input-group']}>
            <BsKeyFill className={classes.icon} />
            <input
              type={passwordType2}
              value={passwordInput}
              onChange={passwordInputChangedHandler}
              onBlur={passwordInputBlurHandler}
            />
            {!showPassword2 && (
              <BsEyeFill className={classes.icon} onClick={passwordActionSee2} style={{ cursor: 'pointer' }} />
            )}
            {showPassword2 && (
              <BsEyeSlashFill className={classes.icon} onClick={passwordActioBlind2} style={{ cursor: 'pointer' }} />
            )}
          </div>
          {passwordInputIsInvalid && <span>This field cannot be empty.</span>}
        </div>
        <div className={confirmPasswordInputClasses}>
          <label>Confirm new password</label>
          <div className={classes['input-group']}>
            <BsKeyFill className={classes.icon} />
            <input
              type={passwordType3}
              value={confirmPasswordInput}
              onChange={confirmPasswordInputChangedHandler}
              onBlur={confirmPasswordInputBlurHandler}
            />
            {!showPassword3 && (
              <BsEyeFill className={classes.icon} onClick={passwordActionSee3} style={{ cursor: 'pointer' }} />
            )}
            {showPassword3 && (
              <BsEyeSlashFill className={classes.icon} onClick={passwordActioBlind3} style={{ cursor: 'pointer' }} />
            )}
          </div>
          {confirmPasswordInputIsInvalid && <span>This field cannot be empty.</span>}
        </div>
        <div className={classes.action}>
          <button type="submit" disabled={!formIsValid}>
            Change
          </button>
        </div>
      </form>
    </animated.div>
  );
};

export default Password;
