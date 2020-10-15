import React, { useState, useEffect } from 'react';
import { firebase } from './config';
import { FirebaseAuthContext } from './FirebaseAuthContext';

const FirebaseAuthProvider = ({ children }) => {

    const [currentUser, setUser] = useState(null);

    useEffect(() => {
        let unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setUser(user);
            } else {
                // Once user signs out user will be set to null so that the screen will switch to splash screen.
                setUser(null);
            }
        })

        return () => {
            unsubscribe();
        }

    }, []);

    return (

        <FirebaseAuthContext.Provider value={{ currentUser }}>
            {children}
        </FirebaseAuthContext.Provider>

    );
};

export {
    FirebaseAuthProvider
}