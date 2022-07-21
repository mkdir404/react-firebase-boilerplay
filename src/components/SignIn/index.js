import React , { useState }   from 'react'
import {withFirebase} from '../Firebase'
import * as ROUTES from '../../constants/routes'
import {useNavigate} from 'react-router-dom'

import {SignUpLink} from '../SignUp'
import {PasswirdForgetLink, PasswordForgetLink} from '../PasswordForget'

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/account-exists-with-different-credential';
const ERROR_MSG_ACCOUNT_EXISTS = ` An account with an E-Mail address to this social account already exists. Try to login from this account instead and associate your social accounts on your personal account page.`;


function SignIn() {
  return (
    <div>
      <h1>SignIn</h1>
      <SignInForm/>
      <SignInGoogle/>
      <SignInFacebook/>
      <PasswordForgetLink/>
      <SignUpLink/>
    </div>
  )
}

function  SignInFormbase({firebase}) {

  const [formState, setFormState] = useState({
    email: '',
    password: '',
    error:null
  });

  const { email, password, error } = formState;

  const navigate = useNavigate();

  const onSubmit = (e) => {
    firebase.doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        setFormState({ ...formState, error: null });
        navigate(ROUTES.HOME);
      }
      ).catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) { error.message = ERROR_MSG_ACCOUNT_EXISTS; }
        setFormState({ ...formState, error });
      }
      );
    e.preventDefault();
  }

  const onChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    })
  }

  const isInvalid = password === '' || email === '';


  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input type="text"  value={email} name="email" onChange={onChange} />
        <label>Password</label>
        <input type="password"  value={password} name="password" onChange={onChange} />
        <button type="submit" disabled={isInvalid} >Sign In</button>
        {error && <p>{error.message}</p>}
      </form>
    </div>
  )

}

function SignInGoogleFormBase({firebase}) {

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    
    firebase.doSignInWithGoogle()
      .then(authUser => {
        
        //Create a new user in the database if it doesn't exist

        return firebase.user(authUser.user.uid).set({
          username: authUser.user.displayName,
          email: authUser.user.email,
          roles: {},
        })

      }).
      then(() => {
        setError(null)
        navigate(ROUTES.HOME)        
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) { error.message = ERROR_MSG_ACCOUNT_EXISTS; }
        setError(error);
      });
    
      e.preventDefault();
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <button type="submit">Sign In with Google</button>
        {error && <p>{error.message}</p>}
      </form>
    </div>
  )
}

function SignInFaceBookFormBase({firebase}) {

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    
    firebase.doSignInWithFacebook()
      .then(authUser => {
        
        //Create a new user in the database if it doesn't exist

        return firebase.user(authUser.user.uid).set({
          username: authUser.additionalUserInfo.profile.name, 
          email:    authUser.additionalUserInfo.profile.email,
          roles: {},
        })

      }).
      then(() => {
        setError(null)
        navigate(ROUTES.HOME)        
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) { error.message = ERROR_MSG_ACCOUNT_EXISTS; }
        setError(error);
      });
    
      e.preventDefault();
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <button type="submit">Sign In with Facebook</button>
        {error && <p>{error.message}</p>}
      </form>
    </div>
  )
}


const SignInForm = withFirebase(SignInFormbase)
const SignInGoogle = withFirebase(SignInGoogleFormBase)
const SignInFacebook = withFirebase(SignInFaceBookFormBase)

export default SignIn
export {SignInForm , SignInGoogle}

