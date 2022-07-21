import React , {useState}from 'react'
import {withFirebase} from '../Firebase'

function PasswordChangeForm({firebase}) {

  const [formState, setformState] = useState({
    passwordOne: '',
    passwordTwo: '',
    error: null,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    firebase.doPasswordUpdate(formState.passwordOne).then(() => {
      setformState({
        passwordOne: '',
        passwordTwo: '',
        error: null,
      });
    }).catch(error => {
      setformState({
        passwordOne: '',
        passwordTwo: '',
        error: error,
      });
    });
  }

  const onChange = (e) => {
    setformState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  } 

  const {passwordOne, passwordTwo, error} = formState;
  const isInValid = passwordOne !== passwordTwo || passwordOne === '';


  return (
    <div>
      <h1>PasswordChangeForm</h1>
      <form onSubmit={onSubmit}>
        <label>
          Password:
          <input type="password" name="passwordOne" onChange={onChange} />
        </label>
        <label>
          Confirm Password:
          <input type="password" name="passwordTwo" onChange={onChange} />
        </label>
        <button type="submit" disabled={isInValid} >Change My Password</button>
        {formState.error && <p>{formState.error.message}</p>}
      </form>        
    </div>
  )
}


export default withFirebase(PasswordChangeForm)