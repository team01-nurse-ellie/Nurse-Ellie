import { firebase } from '../components/Firebase/config';


const userCollection = firebase.firestore().collection("users");

// Adds a medication to user
export async function addMedication (userId, medObj){
    let isMedAdded;
    // See if drug object valid with check for unique rxcui identifier
    let medHasRxcui = medObj.hasOwnProperty('rxcui');
    // Check if medication already added to user
    if(medHasRxcui) {
        try {
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
        } catch (error) {
            throw error;
        }
    } else {
        throw Error('Cannot add medication, object does not contain "rxcui" property');
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

// get all medication documents for a user
export async function getAllMedications(userId) {
    var medications = [];
    await userCollection.doc(userId).collection("medications").get(
    ).then( querySnapshot => {
        querySnapshot.forEach( doc => {
            medications.push(doc);
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