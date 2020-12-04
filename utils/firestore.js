import { not } from 'react-native-reanimated';
import { firebase } from '../components/Firebase/config';
import { usersRef } from './databaseRefs.js';

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
    return await userCollection.doc(userId).collection("medications").add(medObj)
        .then(docRef => {
            return docRef.id;
        }).catch(error => {
            alert("Failed to add medication!");
        });
}

// get all medication documents for a user
export async function getAllMedications(userId) {
    var medications = [];
    await userCollection.doc(userId).collection("medications").get(
    ).then(async querySnapshot => {
        querySnapshot.forEach( doc => {
            medications.push(doc.data());
        })
    }).catch(error => {
        console.log(error)
    });
    return medications;
}

// get all today's medications  for a user
export async function getCurrentMedications(userId) {
    let medications = [];
    let match = false;
    // Current date without time
    var today = new Date();
    today.setHours(0,0,0,0);
    // retrieve medications where today lies within their startDate, endDate, and daysOfWeek
    await userCollection.doc(userId).collection("medications"
    ).where(
        'startDate', '<=', today
    ).get(
    ).then(async querySnapshot => {
        querySnapshot.forEach( doc => {
            medications.push(doc.data());
            match = true;
        })
        // check day of week
        if (match) {
            match = false;
            //filter array by day index. sun=0...sat=6
            const date = new Date();
            const day = date.getDay();
            // filter array further if medication end dates are >= today
            medications = medications.filter( function(item ) {
                return item.daysOfWeek.includes(day);
            })
            if (medications.length > 0) match = true;
        }
        // check medication end date
        if (match) {
            match = false;
            medications = medications.filter( function(item) {
                return item.endDate.toDate() >= today;
            });
        }
    }).catch(error => {
        console.log(error);
    });
     return medications; 
}

// get medication by docid
export async function getMedication(userId,medId) {
    const doc = await userCollection.doc(userId).collection("medications").doc(medId).get();
    if (!doc.exists) {
        console.log('No such document!');
      } else {
        return doc.data();
      }
}

// Removes a medication from user
export async function removeMedication(userId, medId) {
    await userCollection.doc(userId).collection("medications").doc(medId).delete(
    ).catch(error => {
        console.log("Could not delete medication document "+ medId + error);
    })
}

// Update medication for user
export async function updateMedication (userId, medId, medObj) {
    await userCollection.doc(userId).collection("medications").doc(medId).update(
        medObj
    ).catch(error => {
        console.log("Could not update medication document" + medId + error);
    })
}

// get user's full name
export async function getUserName(userId) {
    userCollection.doc(userId).get().then(doc => {
        if (!doc.exists) {
            console.log('No such user document!');
        } else {
            return doc.data();
        }
    })
}


// Return array of patients with their medications
export async function getallPatients(hpUserId) {
    var hpUser;
    var hpUserLinks = []
    var patients = [];
    try {
    // get health professionals user document
    await userCollection.doc(hpUserId).get().then(async doc => {
        if (doc.data()) 
            hpUser= doc.data();
            hpUserLinks = hpUser.userLinks;
    });
    // get all patients with matching health professional userLink codes
    for (const connCode of hpUserLinks) {
        var userObj = {};
        await userCollection
        .where('userLinks', 'array-contains', connCode).get()
        .then(async querySnapshot => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach( async doc => {
                    if (doc.id != hpUserId){
                        userObj = doc.data();
                        userObj['patientId'] = userObj['id'];
                        userObj.isPatient = 'true';
                        patients.push(userObj);
                    }
                })
                // 
            }
        });
    }
    return patients;
    } catch (error) {
        throw error;
    }
}

//

// Retrieve todays medications from users medicationAlarms collection of Expo notifications
export async function getDailyMedications(uid) {
    /*
    notification:
        id: <expo notfication id>
        medicationId: <document id of medication in users medications collection
        rxcui: <rxNorm unique identifier for drug. property in medication>
        trigger: <millisecond UTC timestamp of intake time of notification>
    medication:  (see medication.js, AddMedication orEditMedication screen for more complete object format)
        nameDisplay:,
        route:,
        rxcui:,
        ...
        strength:,
        tty:,
    */
    let notifMatches = []   // medications that still need to be taken today
    let medNotif = {      // object in notifMatches that stores all notification info and medication (drug info + drug settings)
        'notification': {},
        'medication' : {},
        'medID' : '', 
    }
    // todayish in ms 1607096916779 Dec 4 3:49 pm utc
    const MS_TO_DAYS = 86400000.0;
    // get todays date in UTC epoch time
    let todayDate = new Date();
    let todayMs = todayDate.getTime();
    let todayDays = Math.floor(todayMs /MS_TO_DAYS);

    // An alarm document corresponds to one user. It's doc id matches it's user's doc id
    // A medicationAlarm document corresponds to single mediction.
    // A medicationAlarm contain an array of the daily notifications for that medication

    // Find medications notifications that need to be taken today
    await firebase.firestore().collection("alarms").doc(uid).collection("medicationAlarms").get(     
    ).then(async querySnapshot => {
        // Check all medication alarms
        querySnapshot.forEach( medAlarm => {
            // console.log('medAlarm document ids: ' + medAlarm.id);
            // console.log('medAlarm notification length is: ' + medAlarm.data().notifications.length);
            // check single medication's notifications if scheduled for today
            let dailyNotifications = medAlarm.data().notifications;
            dailyNotifications.forEach( notification => {
                // Determine if notification UTC days matches todays UTC days
                let triggerDays = Math.floor(notification.trigger / MS_TO_DAYS);
                if ( triggerDays == todayDays) {
                    let matchMedNotif = {};
                    // console.log('matched notif: ' + notification.medicationID);
                    matchMedNotif.notification = notification;
                    notifMatches.push(matchMedNotif);
                }
            })
        })
    }).catch(error => {
        console.log(error)
    });
    
    for (medNotif of notifMatches) {
        // console.log('notif matches medication id: ' + medNotif.notification.medicationID);
    }

    const medRef = usersRef.doc(uid).collection("medications");

    // Add the medication object (has info & settings) from user collection to each medication notification
    for (medNotif of notifMatches) {
        let medId = medNotif.notification.medicationID;
        // console.log('searching for med info for: ' + medId);
        await medRef.doc(medId).get().then(querySnapshot => {
            medNotif.medication = querySnapshot.data();
            medNotif.medID = querySnapshot.id;
            // console.log('medication data found for: ' + medNotif.medication.nameDisplay);
        })

    }

    // console.log('Number of medication notif matches for today: ' + notifMatches.length);
    // console.log('final matches names: ');
    // for (medNotif of notifMatches) {
    //     console.log('medication object match nameDisplay: ' + medNotif.medication.nameDisplay);
    //     console.log('medication object match rxcui: ' + medNotif.medication.rxcui);
    // }
    // console.log('medNotif of first: ');
    // console.log(notifMatches[0]);
    // console.log(notifMatches);
    return notifMatches;

    // For each match get medication information (ie strength, name, settings) from user's medications collection
}

// Records intake history for one scheduled medication
export async function intakeMedication(rxcui, timestamp,status) {
    // User -> medicationIntake -> intake docs
    return null;
}

/*
const data = [
    { day: 'Sun', taken: 2, total: 2, label: "2"}, 
    { day: 'Mon', taken: 3, total: 3, label: "3"}, 
    { day: 'Tue', taken: 1, total: 2, label: "1"}, 
    { day: 'Wed', taken: 3, total: 3, label: "3"},
    { day: 'Thr', taken: 3, total: 4, label: "3"}, 
    { day: 'Fri', taken: 1, total: 2, label: "1"}, 
    { day: 'Sat', taken: 3, total: 2, label: "3"},
] 
*/
// Retrieve intake statistics for: last 7 days, yesterday, today, tomorrow
export async function getWeekIntakeStats(rxcui, timestamp,status) {
    // User -> medicationIntake -> intake docs
    return null;
}