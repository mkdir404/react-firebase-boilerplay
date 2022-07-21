import React , {useState , useEffect }from 'react'
import AuthUserContext from './context'
import { withFirebase } from '../Firebase'

const withEmailVerification = Component => {
    const WithEmailVerification = ({ firebase, ...otherProps }) => {

       const [isSent, setIsSent] = useState(false);       

        const onSendEmailVerification = () => {
            firebase.doSendEmailVerification().then(() => {
                setIsSent(true);
            })
        }
                
        return (
            <AuthUserContext.Consumer>
                {authUser => (                    
                    authUser && 
                        authUser.emailVerified ? (
                        <Component {...otherProps}/>

                    ):(
                        <div>                            
                            {isSent ? (
                                <p>
                                    E-Mail confirmation sent: Check you E-Mails (Spam folder included) for a 
                                    confirmation E-Mail. Refresh this page once you confirmed your E-Mail.
                                </p>
                                    
                            ) : (
                                <p> Verify your E-Mail: Check you E-Mails (Spam folder included) 
                                    for a confirmation E-Mail or send another confirmation E-Mail.
                                </p>
                            )}
                            
                            <button type="text" disabled={isSent} onClick={onSendEmailVerification}>
                                Send Confirmation E-Mail
                            </button>

                        </div>
                    )
                )}
            </AuthUserContext.Consumer>
        );
    }
    return withFirebase(WithEmailVerification);
}


export default withEmailVerification;