import React , { useState }   from 'react'
import {withFirebase} from '../Firebase'
import * as ROUTES from '../../constants/routes'
import {Link ,  useNavigate} from 'react-router-dom'
import * as ROLES from '../../constants/roles'

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';
const ERROR_MSG_ACCOUNT_EXISTS = ` An account with this E-Mail address already exists.
Try to login with this account instead. If you think the account is already used from one of the social logins, try to sign-in with one of them. Afterward, associate your accounts on your personal account page.`;

function SignUp() {
  return (
    <div>
      <h1>SingUp</h1>
      <SignUpForm/>
    </div>
  )
}

function SignUpFormBase({firebase, history}) {

  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    username:'',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
    error:null
  })

  const { username, email, password, confirmPassword, error , isAdmin } = formState
  
  const onSubmit = (e) => {    

      const roles = {}

      if(isAdmin) {
        roles[ROLES.ADMIN] = ROLES.ADMIN
      }

      firebase.doCreateUserWithEmailAndPassword(email, password).
      then(authUser => {
        // Create a user in your Firebase Realtime Database too
        return firebase.user(authUser.user.uid).set({
          username,
          email,
          roles
        })
      }).then(() => {
        return firebase.doSendEmailVerification()
      })      
      .then(authUser => {
          setFormState({ ...formState, error: null })
          navigate(ROUTES.HOME)
        }).
        catch(error => {          
          if(error.code === ERROR_CODE_ACCOUNT_EXISTS) {
            error.message = ERROR_MSG_ACCOUNT_EXISTS;
          }          
          setFormState({ ...formState, error })
        });

        e.preventDefault()
  }

  const onchange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    })
  }

  const onChangeCheckbox = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.checked
    })
  }

  

  const isInvalid = password !== confirmPassword ||
                    password === '' ||
                    email === '' ||
                    username === '';

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Username</label>
        <input type="text"  value={username} name="username" onChange={onchange} />
        <label>Email</label>
        <input type="text" value={email} name="email" onChange={onchange} />
        <label>Password</label>
        <input type="password" value={password} name="password" onChange={onchange} />
        <label>Confirm Password</label>
        <input type="password" value={confirmPassword} name="confirmPassword" onChange={onchange} />
        <label>
          <input type="checkbox" name="isAdmin" checked={isAdmin} onChange={onChangeCheckbox} />
          Admin
        </label>
        <button type="submit" disabled={isInvalid}>
          Sign Up
        </button>
        {error && <p>{error.message}</p>}
      </form>
    </div>
  )
}

function SignUpLink(){
  return (
    <p>
      Don't have an account? <Link to="/signup">Sign Up</Link>
    </p>
  )
}

const SignUpForm = withFirebase(SignUpFormBase)

export default SignUp
export { SignUpForm, SignUpLink }