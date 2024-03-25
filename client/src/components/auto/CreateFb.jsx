import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoaderData } from 'react-router-dom';

import classes from './CreateFb.module.css';
import Spinner from '../UI/Spinner';
import { alertActions } from '../../store/alert-slice';
import { createFbAccount } from '../../api/api';
import { getFbMessages } from '../../api/api';

const CreateFb = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const nameRef = useRef(null);
  const cookiesRef = useRef(null);
  const uidsRef = useRef(null);
  const messagesRef = useRef(null);
  const dispatch = useDispatch();
  const res = useLoaderData();

  const msgRecieved = res.data.messages;

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    const cookies = cookiesRef.current.value.replace('name', 'key');
    const data = {
      name: nameRef.current.value,
      cookies: JSON.parse(cookies),
      usernames: JSON.parse(uidsRef.current.value),
      messages: JSON.parse(messagesRef.current.value),
    };

    const res = await createFbAccount(data);

    if (res.status === 'success') {
      dispatch(alertActions.setState({ message: res.message, status: res.status }));
    } else {
      dispatch(alertActions.setState({ message: res.message, status: 'error' }));
    }
    setShowSpinner(false);
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {showSpinner && <Spinner />}
      <h2>Profile data</h2>
      <div className={classes.group}>
        <label>Fullname</label>
        <input type="text" ref={nameRef} />
      </div>
      <div className={classes.group}>
        <label>Cookies</label>
        <textarea type="text" ref={cookiesRef} />
      </div>
      <div className={classes.group}>
        <label>Usernames & uids</label>
        <textarea type="text" ref={uidsRef} />
      </div>
      <div className={classes.group}>
        <label>Choose Messages</label>
        <select ref={messagesRef}>
          <option>Select</option>
          {msgRecieved.map((el) => (
            <option value={JSON.stringify(el.messages)}>{el.name}</option>
          ))}
        </select>
      </div>
      <div className={classes.action}>
        <button type="submit">Create account</button>
      </div>
    </form>
  );
};

export default CreateFb;

export const loader = () => {
  return getFbMessages();
};
