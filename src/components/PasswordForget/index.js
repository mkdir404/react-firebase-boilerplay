import React, {useState} from 'react'
import {Link, Routes} from 'react-router-dom'
import {withFirebase} from '../Firebase'
import * as ROUTES from '../../constants/routes'

function PasswordForget() {
  return (
    <div>
      <h1>PasswordForget</h1>
      <PasswordForgetForm />
    </div>
  )
}

function PasswordForgetFormBase({firebase}) {

  const [email, setEmail] = useState({
    email: '',
    error: null,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    firebase.doPasswordReset(email.email).then(() => {
      setEmail({
        email: '',
        error: null,
      });
    }).catch(error => {
      setEmail({
        email: '',
        error: error,
      });
    });    
  }

  const onChange = (e) => {
    setEmail({
      ...email,
      [e.target.name]: e.target.value,
    });
  }

  const isInValid = () => {
    return email.email==='';
  } 

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>
          Email:
          <input type="text" name="email" onChange={onChange} />
        </label>
        <button type="submit">Reset My Password</button>
        {email.error && <p>{email.error.message}</p>}

      </form>
    </div>
  )
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
)

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export default PasswordForget

export {PasswordForgetForm, PasswordForgetLink}