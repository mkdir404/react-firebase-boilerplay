import React from 'react'
import {withFirebase} from '../Firebase'

function SignOutButton({firebase}) {

  const signOut = () => {
    firebase.doSignOut();
  }

  return (
    <button type='button' onClick={signOut} >
      SignOut
    </button>
  )
}
export default withFirebase(SignOutButton)