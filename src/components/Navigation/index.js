import React from 'react'
import * as ROUTES from '../../constants/routes'
import SignOutButton from '../SignOut'
import {Link} from 'react-router-dom' 
import { AuthUserContext } from '../Session'
import * as ROLES from '../../constants/roles'

function Navigation() {    
  return (
    <div> 
        <AuthUserContext.Consumer>
            {authUser => authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />}
        </AuthUserContext.Consumer>
    </div>
  )
}

function NavigationAuth({authUser}) {
    return (
        <ul>
            <li><Link to={ROUTES.LANDING}>Landing</Link> </li>
            <li> <Link to={ROUTES.HOME}>Home</Link> </li> 
            <li> <Link to={ROUTES.ACCOUNT}>Account</Link> </li> 
            {
                !!authUser.roles[ROLES.ADMIN] && <li> <Link to={ROUTES.ADMIN}>Admin</Link> </li>
            }            
            <li> <SignOutButton /> </li>
        </ul>    
    );
}   

function NavigationNonAuth(){
    return (
        <ul> 
            <li> <Link to={ROUTES.LANDING}>Landing</Link> </li> 
            <li> <Link to={ROUTES.SIGN_IN}>Sign In</Link> </li> 
        </ul>
    );
}


export default Navigation