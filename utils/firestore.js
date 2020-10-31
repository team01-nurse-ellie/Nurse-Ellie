import { firebase } from '../components/Firebase/config';

const userCollection = firebase.firestore().collection("users");

// Adds a medication to user collection
export async function addMedication (userId, medObj){
    // Check if drug object valid (has rxcui from rxnorm)
    let medHasRxcui = medObj.hasOwnProperty('rxcui');
    // Checks before adding medication to DB
    if(medHasRxcui) {
        // Check if medication already added to user collection
        try {
            await userCollection.doc(userId).collection("medications")
                .where("rxcui", "==", medObj.rxcui)
                .get()
                .then(async querySnapshot => {
                    if (!querySnapshot.empty) {
                        throw Error('Medication already in user collection');
                    }
            });
        } catch (error) {
            throw error;
        }
    } else {
        throw Error('Cannot add medication, object does not contain "rxcui" property');
    }
    // Checks passed, ready to add medication to user collection
    await userCollection.doc(userId).collection("medications").add(medObj
        ).then(console.log('medication added')
        ).catch(error => {
            alert("Failed to add medication!");
        });
}

// get all medication documents for a user
export async function getAllMedications(userId) {
    var medications = [];
    await userCollection.doc(userId).collection("medications").get(
    ).then( querySnapshot => {
        querySnapshot.forEach( doc => {
            medications.push(doc.data());
            console.log(doc.data());
        })
    }).catch(error => {
        console.log(error)
    });
    return medications;
}

// Removes a medication from user
export async function removeMedication (userId, medId) {
    
}

// Update medication for user
export async function updateMedication (userId, medId, medObj) {
    await userCollection.doc(userId)

}