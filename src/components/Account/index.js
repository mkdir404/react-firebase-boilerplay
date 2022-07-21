import React , {useState , useEffect }from 'react'
import { PasswordForgetForm } from '../PasswordForget'
import PasswordChangeForm  from '../PasswordChange'
import {AuthUserContext , withAuthorization ,withEmailVerification} from '../Session'
import { withFirebase } from '../Firebase'
import {compose} from 'recompose'

const SIGN_IN_METHODS = [
  {
    id: 'password',
    provider: null,
  },
  {
    id: 'google.com',
    provider: 'googleProvider',
  },
  {
    id: 'facebook.com',
    provider: 'facebookProvider',
  },
  /*{
    id: 'twitter.com',
    provider: 'twitterProvider',
  } //,*/
];

function Account() {
  return (  
    <AuthUserContext.Consumer>
    {authUser => (
        <div>
          <h1>Account : {authUser.email}</h1>
          <PasswordForgetForm/>
          <PasswordChangeForm/>
          <LoginManagement authUser={authUser} />
      </div>    
    )}
    </AuthUserContext.Consumer>
  )
}

function LoginManagementBase({firebase,authUser}) {

  const [activeSingIn, setActiveSingIn] = useState({
    activeSignInMethod: null,
    error: null,
  });

  

  useEffect(() => {              
      fetchSignInMethods()      
  }, []);

  const fetchSignInMethods = () => {
           
    firebase.auth.fetchSignInMethodsForEmail(authUser.email).then(signInMethods => {      
      setActiveSingIn({
        activeSignInMethod: signInMethods,
        error: null,
      });      
    }
    ).catch(error => {
      setActiveSingIn({
        activeSignInMethod: null,
        error,
      });
    });

  }

  const onSocialLoginLink = provider => {

      /*firebase.auth.currentUser.linkWithPopup(provider).then(result => {
        fetchSignInMethods();
      }).catch(error => {
        setActiveSingIn({
          activeSignInMethod: null,
          error,
        });
      }) */
  }

  const onUnlink = providerId => {
    /*firebase.auth.currentUser.unlink(providerId).then(result => {
      fetchSignInMethods();
    }).catch(error => {
      setActiveSingIn({
        activeSignInMethod: null,
        error,
      });
    }
    );*/
  }


  return (
    <div>
      Sign In Methods:
      <ul>
        {SIGN_IN_METHODS.map(signInMethod =>{

          const onlyOneLeft = activeSingIn.activeSignInMethod?.length === 1;
          const isEnable = activeSingIn.activeSignInMethod?.includes(signInMethod.id);

          return(
            <li key={signInMethod.id}>
              {isEnable ? (
                <button onClick={onUnlink(signInMethod.id)}>
                  Sign Out
                </button>
              ) : (
                <button onClick={onSocialLoginLink(signInMethod.id.provider)}>
                  Sign In With {signInMethod.id}
                </button>
              )}
            </li>
          )              
        })}
      </ul>
      {activeSingIn.error && <p>{activeSingIn.error.message}</p>}
    </div>
  )
}

const LoginManagement = withFirebase(LoginManagementBase);
const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Account);