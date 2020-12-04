import { firebase } from '../components/Firebase/config';

const userCollection = firebase.firestore().collection("users");

// Adds a symptom checklist to user collection
export async function addSymptomChecklist (userId, symCheck){
    await userCollection.doc(userId).collection("symptomChecklists")
        .add(symCheck)
        .catch(error => {
            alert("Failed to add Symptom Checklist!");
        });
}