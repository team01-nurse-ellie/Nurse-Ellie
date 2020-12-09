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

// Retrieve a symptom checklist from a user
export async function getAllSymptomChecklists(userId) {
    var symptomChecklists = [];
    await userCollection.doc(userId).collection("symptomChecklists").get(
    ).then(async querySnapshot => {
        querySnapshot.forEach( doc => {
            symptomChecklists.push(doc.data());
        })
    }).catch(error => {
        console.log(error)
    });
    return symptomChecklists;
}