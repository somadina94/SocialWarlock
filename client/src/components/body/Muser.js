import { useState, useRef } from 'react';
import useInput from '../../hooks/userInput';
import { useDispatch } from 'react-redux';

import classes from './Muser.module.css';
import { uploadAndSort } from '../../api/api';
import Spinner from '../UI/Spinner';
import { alertActions } from '../../store/alert-slice';

const Muser = () => {
  const [all, setAll] = useState(null);
  const [singleMales, setSingleMales] = useState(null);
  const [singleFemales, setSingleFemales] = useState(null);
  const [marriedMales, setMarriedMales] = useState(null);
  const [marriedFemales, setMarriedFemales] = useState(null);
  const [showDownloads, setShowDownloads] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  //   const {
  //     value: fileInput,
  //     enteredValueIsValid: fileInputIsValid,
  //     hasError: fileInputIsInvalid,
  //     valueInputChangedHandler: fileInputChangedHandler,
  //     valueInputBlurHandler: fileInputBlurHandler,
  //     reset: fileInputReset,
  //   } = useInput((value) => value);

  const {
    value: keyInput,
    enteredValueIsValid: keyInputIsValid,
    hasError: keyInputIsInvalid,
    valueInputChangedHandler: keyInputChangedHandler,
    valueInputBlurHandler: keyInputBlurHandler,
    reset: keyInputReset,
  } = useInput((value) => value.trim() !== '');

  let formIsValid = false;
  if (fileRef.current && keyInputIsValid) {
    formIsValid = true;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowSpinner(true);

    const formData = new FormData();
    formData.append('file', fileRef.current.files[0]);
    formData.append('key', keyInput);

    const res = await uploadAndSort(formData);

    if (res.status === 'success') {
      dispatch(alertActions.setState({ message: 'Files have been sorted successfully', status: res.status }));
      setAll(res.data.download.allUids);
      setSingleMales(res.data.download.singleMale);
      setSingleFemales(res.data.download.singleFemale);
      setMarriedMales(res.data.download.marriedMale);
      setMarriedFemales(res.data.download.marriedFemale);
      setShowDownloads(true);
    } else {
      dispatch(alertActions.setState({ message: res.message, status: 'error' }));
    }

    keyInputReset();
    setShowSpinner(false);
  };

  const keyInputClasses = keyInputIsInvalid ? `${classes.group} ${classes.invalid}` : classes.group;
  return (
    <section className={classes.muser}>
      {showSpinner && <Spinner />}
      <h2>Upload a .csv file below and receive the files sorted according to your needs in a text file</h2>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.group}>
          <label>The .csv file you downloaded</label>
          <input type="file" ref={fileRef} />
        </div>
        <div className={keyInputClasses}>
          <label>Your KEY</label>
          <input type="text" value={keyInput} onChange={keyInputChangedHandler} onBlur={keyInputBlurHandler} />
        </div>
        <div className={classes.action}>
          <button type="submit" disabled={!formIsValid}>
            Upload
          </button>
        </div>
      </form>
      {showDownloads && (
        <div className={classes.downloads}>
          <a href={all} target="_blank" rel="noopener noreferrer" download>
            All uids
          </a>
          <a href={singleMales} target="_blank" rel="noopener noreferrer" download>
            Single males / no relationship status
          </a>
          <a href={singleFemales} target="_blank" rel="noopener noreferrer" download>
            Single females / no relationship status
          </a>
          <a href={marriedMales} target="_blank" rel="noopener noreferrer" download>
            Married males / In a relationship
          </a>
          <a href={marriedFemales} target="_blank" rel="noopener noreferrer" download>
            Married females / In a relationship
          </a>
        </div>
      )}
    </section>
  );
};

export default Muser;
