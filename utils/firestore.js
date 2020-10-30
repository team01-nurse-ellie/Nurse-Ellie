import { firebase } from '../components/Firebase/config';

const userCollection = firebase.firestore().collection("users");

// Adds a medication to  user
export async function addMedication (userId, medObj){
    let isMedAdded;
    // See if drug object valid with check for unique rxcui identifier
    let medHasRxcui = medObj.hasOwnProperty('rxcui');
    // Check if medication already added to user
    if(medHasRxcui) {
        await userCollection.doc(userId).collection("medications")
            .where("rxcui", "==", medObj.rxcui)
            .get()
            .then(async querySnapshot => {
                if (querySnapshot.empty) {
                    console.log('not added already');
                    isMedAdded = false;
                } else 
                {
                    console.log('med already in db');
                    isMedAdded = true;
                }
            });
    }
    // Add medication to user collection
    if(!isMedAdded && medHasRxcui) {
        console.log('checks passed. ready to add');
        await userCollection.doc(userId).collection("medications")
        .add(medObj)
        .then(console.log('medication added'))
        .catch(error => {
            alert("Failed to add medication!");
        });
    }
}

// Removes a medication from user
export async function removeMedication (userId, medId) {
    
}

// Updates medication for user
export async function updateMedication (userId, medId, medObj) {

}

// get all medication documents for a user
export async function getAllMedications(userId) {
    var medications = [];
    await userCollection.doc(userId).collection("medication").get(
    ).then( querySnapshot => {
        querySnapshot.forEach( doc => {
            medications.push(doc);
            console.log(doc.id, '=>', doc.data())
        })
    }).catch(error => {
        console.log(error)
    });
    return medications;
}

// get medication from a user