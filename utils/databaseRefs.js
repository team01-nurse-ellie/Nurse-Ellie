import { firebase } from '../components/Firebase/config';

// A list of references to each database document
const accreditationsRef = firebase.firestore().collection('accreditation');
const healthprofsRef = firebase.firestore().collection('healthprofs');
const patientsRef = firebase.firestore().collection('patients');
const rxCollection = firebase.firestore().collection('rxnormTerms');
const symtomChecklists = firebase.firestore().collection('symptom');
const userlinksRef = firebase.firestore().collection('userlinks');
const usersRef = firebase.firestore().collection('users');

// import any when needed   
export {  
    accreditationsRef,
    healthprofsRef,
    patientsRef,
    rxCollection,
    symtomChecklists,
    userlinksRef,
    usersRef
}