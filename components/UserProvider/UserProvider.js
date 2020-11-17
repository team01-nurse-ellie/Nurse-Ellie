import React, { useState, useEffect, useContext } from 'react';
import { firebase } from '../Firebase/config';
import { UserContext } from './UserContext';
import { FirebaseAuthContext } from '../Firebase/FirebaseAuthContext';

const UserProvider = ({ children }) => {

    const { currentUser } = useContext(FirebaseAuthContext);
    const [accountType, setAccountType] = useState(null);
    const [verifiedHP, setVerification] = useState(null);
  
    useEffect(() => {
       
        if (currentUser) {
            firebase.firestore().collection("users").doc(currentUser.uid).get().then(async (doc) => {
                if (doc.exists) {
                    console.log("succ")
                    setAccountType(doc.data().accountType);
                    setVerification(doc.data().verifiedHP);
                }
            }).catch(error => console.log(error));

        } 
        // else {
        //     console.log("fail");    
        // }
 

        return () => {
            
        }

    }, [currentUser]);

    return (

        <UserContext.Provider value={{ accountType, verifiedHP }}>
            {children}
        </UserContext.Provider>

    );
};

export {
    UserProvider
}