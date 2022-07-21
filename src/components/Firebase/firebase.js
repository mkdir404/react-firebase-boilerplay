/*
ESTO CAMBIAR A VARIABLE DE ENTORNO
const prodConfig = { apiKey: process.env.REACT_APP_PROD_API_KEY, authDomain: process.env.REACT_APP_PROD_AUTH_DOMAIN, databaseURL: process.env.REACT_APP_PROD_DATABASE_URL, projectId: process.env.REACT_APP_PROD_PROJECT_ID, storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET, messagingSenderId: process.env.REACT_APP_PROD_MESSAGING_SENDER_ID, };
const devConfig = { apiKey: process.env.REACT_APP_DEV_API_KEY, authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN, databaseURL: process.env.REACT_APP_DEV_DATABASE_URL, projectId: process.env.REACT_APP_DEV_PROJECT_ID, storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET, messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID, };
const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
*/

import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import { getAuth, linkWithPopup } from "firebase/auth";

const config ={
    apiKey: "AIzaSyD4xcxjWRTSh7uW6B-EhQuCrVq-5xMszTA",
    authDomain: "fir-authentication-9792e.firebaseapp.com",
    projectId: "fir-authentication-9792e",
    storageBucket: "fir-authentication-9792e.appspot.com",
    messagingSenderId: "131191577066",
    appId: "1:131191577066:web:a075e2ba21777106933a93",
    measurementId: "G-EVZ08GGESQ"
}

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
        this.googleProvider = new app.auth.GoogleAuthProvider();
        this.facebookProvider = new app.auth.FacebookAuthProvider();                    
        this.serverValue = app.database.ServerValue;        
    }

    // AUTH API 
    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

    //Social Provider

    doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);
    doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

    // Verifcacion Email 

    doSendEmailVerification = () => this.auth.currentUser.sendEmailVerification({
        url: "http://localhost:3001",
    });

    doSignOut = () => this.auth.signOut();
    doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);
    doPasswordUpdate = (password) => this.auth.currentUser.updatePassword(password);

    // USER API

    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');

    // Message API

    message = uid => this.db.ref(`messages/${uid}`);
    messages = () => this.db.ref('messages');

    // MERGE AUTH USER AND USER DATA

    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(snapshot => {
                        
                        const dbUser = snapshot.val();

                        // default empty roles
                        if (!dbUser.roles) {
                            dbUser.roles = {};
                        }

                        

                        // merge auth and db user
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,                            
                            emailVerified: authUser.emailVerified,
                            providerData: authUser.providerData,
                            ...dbUser
                        };
                                            
                        next(authUser);
                    });
            } else {
                fallback();
            }
        });
}

export default Firebase;