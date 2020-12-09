import React, { useState, useEffect, useContext } from 'react';
import { firebase } from '../Firebase/config';
import { UserContext } from './UserContext';
import { FirebaseAuthContext } from '../Firebase/FirebaseAuthContext';

const UserProvider = ({ children }) => {

    const { currentUser } = useContext(FirebaseAuthContext);
    const [accountType, setAccountType] = useState(null);
    const [verifiedHP, setVerification] = useState(null);
    const [fullName, setFullName] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
  
    useEffect(() => {
       
        if (currentUser) {
            firebase.firestore().collection("users").doc(currentUser.uid).get().then(async (doc) => {
                if (doc.exists) {
                    console.log("succ")
                    setAccountType(doc.data().accountType);
                    setVerification(doc.data().verifiedHP);
                    setFullName(doc.data().fullName);
                    let fullName = doc.data().fullName.trim().split(" ");
                    setFirstName(fullName[0]);
                    setLastName(fullName[1]);
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

        <UserContext.Provider value={{ accountType, verifiedHP, firstName, lastName, fullName }}>
            {children}
        </UserContext.Provider>

    );
};

export {
    UserProvider
}