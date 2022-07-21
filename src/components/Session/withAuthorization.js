import React , {useEffect}from 'react'
import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'
import {useNavigate} from 'react-router-dom'
import AuthUserContext from './context';

const withAuthorization = (condition) => (Component) => {
    const WithAuthorization = (props) => {        
    
        const navigate = useNavigate();

        useEffect(() => {

        const listener = props.firebase.onAuthUserListener(                
                
                authUser => {
                        if(!condition(authUser)) {
                            navigate(ROUTES.SIGN_IN);
                        }
                    },
                () => navigate(ROUTES.SIGN_IN)
                
        )

        return () => {
            listener();
        }

        },[]);
    
        return (
            <AuthUserContext.Consumer>        
                {authUser => (
                    condition(authUser) ? <Component {...props} /> : null
                )}
            </AuthUserContext.Consumer>      
        )
    }
    
    return withFirebase(WithAuthorization)
}

export default withAuthorization
