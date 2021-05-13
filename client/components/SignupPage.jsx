import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//Custom hook for handling input fields
//Saves us from creating onChange handlers for each individual state
const useInput = init => {
  const [ value, setValue ] = useState(init);
  const onChange = e => {
    setValue(e.target.value);
  }
  //returns the new text value onChange, using setValue.
  return [ value, onChange ];
};




const Signup = (props) => {
  //setting default state for all input fields
  const [ firstName, firstNameOnChange ] = useInput('');
  const [ lastName, lastNameOnChange ] = useInput('');
  const [ userNumber, userNumberOnChange ] = useInput('');
  const [ email, emailOnChange ] = useInput('');
  const [ password, passwordOnChange ] = useInput('');
  const [ dob, dobOnChange ] = useInput('');
  const [ contactName, contactNameOnChange ] = useInput('');
  const [ contactNumber, contactNumberOnChange ] = useInput('');
  const [ inputError, setInputError ] = useState(null);
  const [ userNumberError, setUserNumberError ] = useState(null);
  const [ contactNumberError, setContactNumberError ] = useState(null);
  const [ emailError, setEmailError ] = useState(null);

  //grabbing useHistory functionality from react-router-dom
  const history = useHistory();
  //passes signup information to the backend when 'signup' button is clicked
  const saveUser = () => {
    if (firstName === '' || lastName === '' || userNumber === '' || email === '' || password === '' || dob === '' || contactName === '' || contactNumber === '') {
      setInputError('Please fill out all fields');
    } else if (isNaN(contactNumber)) {
      setContactNumberError('Please enter a valid 10 digit phone number')
    } else if (isNaN(userNumber)) {
      setUserNumberError('Please enter a valid 10 digit phone number')
    } else if (!/.{1,}@[^.]{1,}/.test(email)) {
      setEmailError('Please enter a valid email')
    } else {
      const body = {
        firstName,
        lastName,
        userNumber,
        email,
        password,
        dob,
        contactName,
        contactNumber
      };
      fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/JSON'
        },
        body: JSON.stringify(body)
      })
        .then(resp => resp.json())
        .then((data) => {
          console.log(data);
        })
        //I think this redirects to homepage. Need to research more.
        // .then(() => {
        //   props.history.push('/');
        // })
        .then(history.push('/'))
        .catch(err => console.log('Signup post request to /signup from SignupPage.jsx failed: Error: ', err))
    }
  }

  //clears inputError when any field is altered
  // useEffect(() => {
  //   setInputError(null);
  // }, [firstName, lastName, userNumber, email, password, dob, contactName, contactNumber, inputError ])

  return(
    <section id='signup-page'>
      <div id='first-name-div'>
        <label htmlFor='fname-input'>First Name:</label>
        <input type='text' id='fname-input' placeholder='First Name' onChange={firstNameOnChange}></input>
      </div>
      <div id='last-name-div'>
        <label htmlFor='last-name-input'>Last Name:</label>
        <input type='text' id='last-name-input' placeholder='Last Name' onChange={lastNameOnChange}></input>
      </div>
      <div>
        <label htmlFor="user-numer-input">Phone Number:</label>
        <input type='tel' id='user-number-input' placeholder='917-777-777' maxLength='10' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' onChange={userNumberOnChange}></input>
        {userNumberError ? (<div id='user-number-error'>{userNumberError}</div>) : null}
      </div>
      <div id='email-input-div'>
        <label htmlFor='email-input'>Email:</label>
        <input type='email' id='email-input' placeholder='youremail@gmail.com' onChange={emailOnChange}></input>
        {emailError ? (<div id='email-error'>{emailError}</div>) : null}
      </div>
      <div id='password-input-div'>
        <label htmlFor='password-input'>Password:</label>
        <input type='password' placeholder='password' id='password-input' onChange={passwordOnChange}></input>
      </div>
      <div id='dob-input-div'>
        <label htmlFor='dob-input'>Date of Birth:</label>
        <input type='date' id='dob-input' onChange={dobOnChange}></input>
      </div>
      <div id='emergency-contact-name-div'>
        <label htmlFor='emergency-contact-name'>Emergency Contact Name:</label>
        <input type='text' id='emergency-contact-name' placeholder='First and Last Name' onChange={contactNameOnChange}></input>
      </div>
      <div id='emergency-contact-number-div'>
        <label htmlFor='emergency-contact-number'>Emergency Contact Number:</label>
        <input type='tel' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' placeholder='917-777-777' maxLength='10' id='emergency-contact-number' onChange={contactNumberOnChange}></input>
        {contactNumberError ? (<div id='contact-number-error'>{contactNumberError}</div>) : null}
      </div>
      <button type='button' id="signup-submit-button" onClick={saveUser}>Sign Up</button>
      {inputError ? (<div id='input-error'>{inputError}</div>) : null}
    </section>
  )
}

export default Signup;