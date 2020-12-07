import { take } from 'lodash';
import { firebase } from '../components/Firebase/config';
import { usersRef, alarmsRef } from './databaseRefs.js';
import * as Notifications from 'expo-notifications';
import { not } from 'react-native-reanimated';
import { calculateLocalTimezone } from './dateHelpers';

// Adds a medication to user collection
const addMedication =  async (userId, medObj) => {
    // Check if drug object valid (has rxcui from rxnorm)
    let medHasRxcui = medObj.hasOwnProperty('rxcui');
    // Checks before adding medication to DB
    if(medHasRxcui) {
        // Check if medication already added to user collection
        try {
            await usersRef.doc(userId).collection("medications")
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
    return await usersRef.doc(userId).collection("medications").add(medObj)
        .then(docRef => {
            return docRef.id;
        }).catch(error => {
            alert("Failed to add medication!");
        });
}

// get all medication documents for a user
const getAllMedications = async (userId) => {
    var medications = [];
    await usersRef.doc(userId).collection("medications").get(
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
const getCurrentMedications = async (userId) => {
    let medications = [];
    let match = false;
    // Current date without time
    var today = new Date();
    today.setHours(0,0,0,0);
    // retrieve medications where today lies within their startDate, endDate, and daysOfWeek
    await usersRef.doc(userId).collection("medications"
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
const getMedication = async (userId,medId) => {
    const doc = await usersRef.doc(userId).collection("medications").doc(medId).get();
    if (!doc.exists) {
        console.log('No such document!');
      } else {
        return doc.data();
      }
}

// Removes a medication from user
const removeMedication = async (userId, medId) => {
    await usersRef.doc(userId).collection("medications").doc(medId).delete(
    ).catch(error => {
        console.log("Could not delete medication document "+ medId + error);
    })
}

// Update medication for user
const updateMedication = async (userId, medId, medObj) => {
    await usersRef.doc(userId).collection("medications").doc(medId).update(
        medObj
    ).catch(error => {
        console.log("Could not update medication document" + medId + error);
    })
}

// get user's full name
const getUserName = async (userId) => {
    usersRef.doc(userId).get().then(doc => {
        if (!doc.exists) {
            console.log('No such user document!');
        } else {
            return doc.data();
        }
    })
}


// Return array of patients with their medications
const getallPatients = async (hpUserId) => {
    var hpUser;
    var hpUserLinks = []
    var patients = [];
    try {
    // get health professionals user document
    await usersRef.doc(hpUserId).get().then(async doc => {
        if (doc.data()) 
            hpUser= doc.data();
            hpUserLinks = hpUser.userLinks;
    });
    // get all patients with matching health professional userLink codes
    for (const connCode of hpUserLinks) {
        var userObj = {};
        await usersRef
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

// Retrieve todays medications from users medicationAlarms collection of Expo notifications
const getDailyMedications = async (uid) => {
    /* 
    medNotif:
    {
        notification: 
        {
            id: <expo notfication id>
            medicationId: <document id of medication in users medications collection
            rxcui: <rxNorm unique identifier for drug. property in medication>
            trigger: <millisecond UTC timestamp of intake time of notification>
        }
        medication:  // the medication object (see medication.js for complete fields)
        {
            nameDisplay:,
            route:,
            rxcui:,
            endDate:,
            intakeTime:,
            ...
            strength:,
            tty:,
        }
        medId: '' // the doc id of medication in user's collection
    }
    */

    let medNotifMatches = []   // medications that still need to be taken today
    let medNotif = {            // Stores both notification and medication info (see above comments)
        'notification': {},
        'medication' : {},
        'medID' : '', 
    }
    const MS_TO_DAYS = 86400000.0;
    // get todays date in UTC epoch time
    let todayDate = new Date();
    let todayMs = todayDate.getTime();
    let todayDays = Math.floor(todayMs /MS_TO_DAYS);

    // An alarm document corresponds to one user. It's document id matches it's user's document id
    // A medicationAlarm document corresponds to single mediction and has array of all daily notifications for that medication

    // Find medications notifications that need to be taken today
    await alarmsRef.doc(uid).collection("medicationAlarms").get(     
    ).then(async querySnapshot => {
        // Check all medication alarms
        querySnapshot.forEach( medAlarm => {
            // check single medication's notifications if scheduled for today
            let dailyNotifications = medAlarm.data().notifications;
            dailyNotifications.forEach( notification => {
                // Determine if notification UTC days matches todays UTC days
                let triggerDays = Math.floor(notification.trigger / MS_TO_DAYS);
                if ( triggerDays == todayDays) {
                    let matchMedNotif = {};
                    // console.log('matched notif: ' + notification.medicationID);
                    matchMedNotif.notification = notification;
                    medNotifMatches.push(matchMedNotif);
                }
            })
        })
    }).catch(error => {
        console.log(error)
    });

    const medRef = usersRef.doc(uid).collection("medications");
    // Add the medication object (has info & settings) from user collection to each medication notification
    for (medNotif of medNotifMatches) {
        let medId = medNotif.notification.medicationID;
        // console.log('searching for med info for: ' + medId);
        await medRef.doc(medId).get().then(querySnapshot => {
            medNotif.medication = querySnapshot.data();
            medNotif.medID = querySnapshot.id;

        })
    }
    return medNotifMatches;
}

// Records intake for medication scheduled for today. 
// Checks if intake already recorded for medication (rxcui cannot have more than on record per day)
const intakeMedication = async (
    uid, // userId
    rxcui, // unique drug identifer in each medication document
    timestamp, // current time when time swipped. (new Date()).getTime()
    status, // string of 'taken' or 'missed'
    notifID = null, // Expo notification ID of notification to be removed after intake successful
    dayOverride = null // for use only with generateIntakeDummyData()
    ) => { 
    
    var medIntakeExists = false;
    var existingIntakeDoc;
    // get todays date in UTC epoch time
    const MS_TO_DAYS = 86400000.0;
    let todayMs = (new Date()).getTime();
    let todayDays = dayOverride == null? Math.floor(todayMs / MS_TO_DAYS) : dayOverride;
    // Create intake object for intake history
    let intakeDoc = {
        'dayStatus': todayDays,  // # days calculated from UTC milliseconds
        'rxcui': rxcui,         // user independent unique identifier for each medication.
        'status': status,       // medication taken or not. 'taken'||'missed'
        'timestampStatus': timestamp, // UTC time in milliseconds
    }
    // Check if medicationIntake of medication alreay exists for today
    await usersRef.doc(uid).collection("medicationIntakes")
        .where("rxcui", "==", rxcui)
        .where("dayStatus", "==", todayDays)
        .get()
        .then(async querySnapshot => {
            if (!querySnapshot.empty) {
                medIntakeExists = true;
                querySnapshot.forEach( intake => {
                    // get reference to existing intake doc, so its status and time can be overwritten
                    existingIntakeDoc = intake.id;
                    // console.log('data of existing medication' + intake.data());
                    // console.log('Medication already has intake status for today!');
                })
            }}
        ).catch(error => {
            console.log(error);
        });
    // If medication has no intake record for today, add intake record
    if (!medIntakeExists) {
        await usersRef.doc(uid).collection("medicationIntakes").add(intakeDoc)
        .then(async docRef => {
            // medication intake is added
        }).catch(error => {
            console.log("Failed to add intake!");
            console.log(error);
        });
    } 
    // If medication has intake record, overwrite record
    else {
        await usersRef.doc(uid).collection("medicationIntakes").doc(existingIntakeDoc).set(intakeDoc
            ).catch(error => {console.log(error);});
    }

    // Delete today's notification data for medication
    if (notifID!=null){
        // Delete Expo Notification for taken/missed medication
        await Notifications.cancelScheduledNotificationAsync(notifID).then(()=> {
        }).catch(error => { throw error; });
        // Only delete Expo notification and medicationAlarms notification
        // console.log('intake(): intake status exists. trying to delete notifID');
        let alarmID, filteredNotifications, notificationIDFound;
        // Delete medicationAlarms notification for taken/missed medication
        await alarmsRef.doc(uid).collection("medicationAlarms").get().then(querySnapshot => {
            // find id of alarm document that contains notification to be removed
            querySnapshot.forEach(alarm => {
                alarm.data().notifications.forEach(notification => {
                    if(notification.id == notifID) {
                        notificationIDFound = true;
                        alarmID = alarm.id;
                        // console.log('intake(): deleting inside alarmID = ' + alarmID);
                        // console.log('intake(): deleting notificationID = ' + notifID);
                        // console.log('intake(): notification trigger = ' + notification.trigger);
                        filteredNotifications = alarm.data().notifications.filter(n=> n.id != notifID);
                    }})
            })}).catch(error => { throw error; });;
            // Delete take/missed medication's notification from alarm
            if (notificationIDFound == true) { 
                alarmsRef.doc(uid).collection("medicationAlarms").doc(alarmID).update({ notifications: filteredNotifications})
                .catch(error => { throw error; });;
            }
    }
}

// Inserts NUM_DAYS days of intake dummy data EXCLUDING today
// Can generate dummy data based on all of users medications, or only those medications scheduled for today
const generateIntakeDummyData = async (uid, allMeds=true) => {
    console.log('generating dummy data');
    const NUM_DAYS = 8;     // specify # days to generate dummy data for, 
    var days = [], timestamps = [], rxcuis = [], takenMissed =[];

    // get rxcuis for all medications or only medications scheduled for today
    if (allMeds) {
        const dailyMeds = await getAllMedications(uid);
        rxcuis = dailyMeds.map(med =>{return med.rxcui;});
    } else {
        const dailyMeds = await getDailyMedications(uid);
        rxcuis = dailyMeds.map(med =>{return med.medication.rxcui;});
    }

    // get todays date in UTC epoch time
    const MS_TO_DAYS = 86400000.0;
    let todayMs = (new Date()).getTime();
    let todayDays = Math.floor(todayMs / MS_TO_DAYS);

    // get last NUM_DAYS as UTC milliseconds and days
    for (let day = 0; day < NUM_DAYS; day++) {
        days.push(todayDays - day);
        timestamps.push( (todayDays - day) * MS_TO_DAYS);
    }
    console.log('\ngenerateDummy(): for timestamps = ' + timestamps);
    console.log('generateDummy(): for days (from timestamps) = ' + days);

    // Fill takenMissed randomly with 1 (taken) or 0 (missed)
    for (let i = 0; i < rxcuis.length; i++) {
        takenMissed.push(Math.round(Math.random()));
    }
    // console.log('generateDummy(): takenMissed = ' + takenMissed);

    console.log('generateDummy(): num rxcuis generating dummy data for = ' + rxcuis.length);
    console.log('generateDummy(): num days generating dummy data for = ' + NUM_DAYS + '\n');
    // Create dummy intake for each medication for last NUM_DAYS days
    for (let day = 1; day < NUM_DAYS; day++) {
        // Set random status for each medication (rxcui)
        for (let rx = 0; rx < rxcuis.length; rx++) {
            let status = takenMissed[rx] == 0 ? 'missed' : 'taken';
            intakeMedication(uid, rxcuis[rx], timestamps[day], status, null, days[day]);
        }
    }
}

// Return percentage (whole number) of daily medications ('taken' / total daily medications scheduled)
const getTodayIntakePercentage = async (uid) => {
    let takenCount = 0  // # medicationIntake with 'taken' status for today
    , missedCount = 0   // # medicationIntake with 'missed' status for today
    , todayPendingNotif = 0; // # notifications for today (does not count rxcuis that already medicationIntake status for today )
    let rxcuisWithIntakeToday = []; // drugs (rxcuis) which already have a medicationIntake status for today
    // get todays date in UTC epoch time
    const MS_TO_DAYS = 86400000;
    let todayMs = (new Date()).getTime();
    // let todayDays = Math.floor(todayMs / MS_TO_DAYS);
    let todayDays = Math.floor(todayMs / MS_TO_DAYS);
    let todayDaysNoTime  = todayDays * MS_TO_DAYS;
    // get counts of intake history for today
    await usersRef.doc(uid).collection("medicationIntakes").where("dayStatus", "==", todayDays).get()
    .then(async querySnapshot => {
        if (!querySnapshot.empty) {
            querySnapshot.forEach( async intake => {
                rxcuisWithIntakeToday.push(intake.data().rxcui);
                if (intake.data().status == "taken") {
                    takenCount++;
                } else if (intake.data().status == "missed") {
                    missedCount++;
                }
            })
        }}
    ).catch(error => {console.log(error);});
    
    // get # of pending notifications (where rxcui doesn't already have a medicationIntake status for today)
    await alarmsRef.doc(uid).collection('medicationAlarms').get().then(async querySnapshot => {
        querySnapshot.forEach(alarm => {
            if (!querySnapshot.empty) {
                // console.log('alarm notifications length = ' + alarm.data().notifications.length);
                alarm.data().notifications.forEach(notification => {
                    // 'No Time' = Remove time values (minutes, etc.) from firestore notification timestamp
                    let triggerNoTime = (Math.floor(notification.trigger / MS_TO_DAYS)) * MS_TO_DAYS;
                    // Count todays 'pending' notifications (need status), excluding those with have status 
                    // Need check if rxcui has status, because user can reschedule a notification for drug that already has an intake 
                    if (triggerNoTime == todayDaysNoTime && !rxcuisWithIntakeToday.includes(notification.rxcui)) {
                        todayPendingNotif++;
                    }
                })
            }
        })
    }).catch(error => { console.log(error);});
    
    // Calculate percentage. taken / ( missed + remaining)
    let intakePercentage = (takenCount / (missedCount + takenCount + todayPendingNotif)) * 100;
    // console.log('\ntodayIntake%(): rxcuisWithIntakeToday = ' + rxcuisWithIntakeToday);
    // console.log('todayIntake%(): taken = ' + takenCount + ' missed = ' + missedCount);
    // console.log('todayIntake%(): todayPendingNotif = ' + todayPendingNotif);
    // console.log('todayIntake%(): intakePercentage = taken / (missed + taken + pending)' );
    // console.log('todayIntake%(): intakePercentage = ' + intakePercentage + '\n');
    return isNaN(intakePercentage) ? 0 : Math.round(intakePercentage);
}



// Retrieve intake statistics for: last 7 days, today and tomorrow
// Should return in format that VictorChart and VictoryBar in MedicationSummary requires:
//     { day: 'Sun', taken: 2, total: 2, label: "2"}
const getWeekIntakeStats = async (uid) => {
    // drpark@gmail.com pass:CPAF2020 has 7 days of dummy data for 6 medications 
    /*
    in users->medicationIntakes
    medicationIntake: {
        dayStatus: (day = timeStampStatus / 86400000)
        rxcui:
        status: missed||taken
        timeStampStatus: timestamp(ms) 
    }
    */

   let dow = [
       {
           day: "Sun",
           meds: []
       },
       {
           day: "Mon",
           meds: []
       },
       {
           day: "Tue",
           meds: []
       },
       {
           day: "Wed",
           meds: []
       },
       {
           day: "Thu",
           meds: []
       },
       {
           day: "Fri",
           meds: []
       },
       {
           day: "Sat",
           meds: []
       },
   ];
   // console.log(todayDays);
    const MS_TO_DAYS = 86400000;
    let todayMs = (new Date()).getTime();
    let todayDays = Math.floor(todayMs / MS_TO_DAYS);
    let tomorrowDays = todayDays + 1;
    let todayDaysNoTime  = calculateLocalTimezone(todayDays * MS_TO_DAYS);
    let tomorrowDaysNoTime  = calculateLocalTimezone(tomorrowDays * MS_TO_DAYS);
    
    console.log("todayDays", todayDays)
    console.log("todayDaysNoTime", todayDaysNoTime)
    console.log("tomorrowDaysNoTime", tomorrowDaysNoTime)

    
    let last7Days = [];
    for (let i = 1; i < 8; i++) {
        // have to -1 b/c todayDays is 1 num higher? 
        last7Days.push((todayDays - 1) - i);
        // last7Days.push((todayDays) - i);
    }
    let allMeds = [];
    let yesterdayMeds = [];
    let todayMeds = [];
    let tomorrowMeds = [];
    // ============= LAST 7 DAYS GRAPH =============
    last7Days.sort((a,b) => a < b); 
    console.log(last7Days, `last7Days`);
    await usersRef.doc(uid).collection("medicationIntakes")
        // last7days - array of last 7 days to fetch medicationIntakes from. 
        .where("dayStatus", "in", last7Days).get().then(async (querySnapshot) => {
            querySnapshot.forEach(doc => {
                allMeds.push(doc.data());
            });
        }).catch(error => { throw error });

    (allMeds).sort((a, b) => a.timestampStatus < b.timestampStatus);
    // (missedMeds).sort((a, b) => a.timestampStatus > b.timestampStatus);

    // console.log(takenMeds)
    for (let i = 0; i < allMeds.length; i++) {
        // IF timestamp coming in is 12am UTC and not 12am Local Time
        let date = new Date((calculateLocalTimezone(allMeds[i].timestampStatus)))
        // console.log(takenMeds[i].timestampStatus);
        //   if (date.getDay() == 0) {
        // push into sunday taken array
        //   } 
        // dayStatus == yesterday daystatus
        if (allMeds[i].dayStatus == last7Days[0]) {
            yesterdayMeds.push(allMeds[i]);
        }

        dow[date.getDay()].meds.push(allMeds[i]);
    }

    // console.log(dow);

    let last7DaysStats = [];

    for (let i = 0; i < dow.length; i++) {
        let takenCount = 0;

        for (let j = 0; j < dow[i].meds.length; j++) {
            if (dow[i].meds[j].status === "taken") {
                takenCount += 1;
            }
        }

        last7DaysStats.push({
            day: dow[i].day,
            taken: takenCount,
            total: dow[i].meds.length,
            label: takenCount.toString()
        })
    }

    // console.log(last7DaysStats);         

    // ============= YESTERDAY STATUS =============
    // yesterday, if all are true say completed, if some arent keep track of count and display 
    // console.log(yesterdayMeds);
    let yesterdayMissedMeds = 0;
    for (let i = 0; i < yesterdayMeds.length; i++) {
        if (yesterdayMeds[i].status === "missed") {
            yesterdayMeds += 1;
        }
    }

    let yesterdayStatus = (yesterdayMeds.length == 0) ? `No meds` : (yesterdayMissedMeds > 0) ? `${yesterdayMissedMeds} Medications left` : `Completed`;
    // ============= TODAY STATUS =============
    // todaysMeds - if a medication with an intake doc with same rxcui it is taken/missed  
    // if in intake doc the rxcui, and timestamp is found in medicationAlarms it means it needs to be DEALT with
    // grab that med  
    let takenCount = 0  // # medicationIntake with 'taken' status for today
    , missedCount = 0   // # medicationIntake with 'missed' status for today
    , todayPendingNotif = 0; // # notifications for today (does not count rxcuis that already medicationIntake status for today )
    let rxcuisWithIntakeToday = []; // drugs (rxcuis) which already have a medicationIntake status for today

    await usersRef.doc(uid).collection("medicationIntakes").where("dayStatus", "==", todayDays).get()
    .then(async querySnapshot => {
        if (!querySnapshot.empty) {
            querySnapshot.forEach( async intake => {
                rxcuisWithIntakeToday.push(intake.data().rxcui);
                if (intake.data().status == "taken") {
                    takenCount++;
                } else if (intake.data().status == "missed") {
                    missedCount++;
                }
            })
        }}
    ).catch(error => {console.log(error);});


     // get # of pending notifications (where rxcui doesn't already have a medicationIntake status for today)
     await alarmsRef.doc(uid).collection('medicationAlarms').get().then(async querySnapshot => {
        querySnapshot.forEach(alarm => {
            if (!querySnapshot.empty) {
                // console.log('alarm notifications length = ' + alarm.data().notifications.length);
                alarm.data().notifications.forEach(notification => {
                    // 'No Time' = Remove time values (minutes, etc.) from firestore notification timestamp
                    let triggerNoTime = calculateLocalTimezone((Math.floor(notification.trigger / MS_TO_DAYS)) * MS_TO_DAYS);
                    // Count todays 'pending' notifications (need status), excluding those with have status 
                    // Need check if rxcui has status, because user can reschedule a notification for drug that already has an intake 
                    if (triggerNoTime == todayDaysNoTime && !rxcuisWithIntakeToday.includes(notification.rxcui)) {
                        todayPendingNotif++;
                    }
                })
            }
        })
    }).catch(error => { console.log(error);});
    
    let todayStatus = (todayPendingNotif == 0) ? `Completed` : `${todayPendingNotif} Medications left`;
    // ============= TOMORROW STATUS =============
    let tomorrowPendingNotif = 0;
      // get # of pending notifications (where rxcui doesn't already have a medicationIntake status for today)
      await alarmsRef.doc(uid).collection('medicationAlarms').get().then(async querySnapshot => {
        querySnapshot.forEach(alarm => {
            if (!querySnapshot.empty) {
                // console.log('alarm notifications length = ' + alarm.data().notifications.length);
                alarm.data().notifications.forEach(notification => {
                    // 'No Time' = Remove time values (minutes, etc.) from firestore notification timestamp
                    let triggerNoTime = calculateLocalTimezone((Math.floor(notification.trigger / MS_TO_DAYS)) * MS_TO_DAYS);
                    // Count todays 'pending' notifications (need status), excluding those with have status 
                    // Need check if rxcui has status, because user can reschedule a notification for drug that already has an intake 
                    if (triggerNoTime == tomorrowDaysNoTime && !rxcuisWithIntakeToday.includes(notification.rxcui)) {
                        tomorrowPendingNotif++;
                    }
                })
            }
        })
    }).catch(error => { console.log(error);});

    let tomorrowStatus = (tomorrowPendingNotif == 0) ? `No medications to take` : `${tomorrowPendingNotif} medications`;
    // ============= GENERAL STATUS =============
    let allTakenMeds = 0;
    let allMissedMeds = 0;
    let totalMeds = 0;
    let medicationIntakeRate = 0.00;
    allMeds.forEach(e => {
        if (e.status === "taken") {
            allTakenMeds += 1;
        }
        
        if (e.status === "missed") {
            allMissedMeds += 1;
        }
    });
    
    totalMeds = allTakenMeds + allMissedMeds;
    
    medicationIntakeRate = (allTakenMeds / totalMeds) * 100;
    
    let generalStatus = (medicationIntakeRate >= 90) ? `Excellent` : `Needs Improvement`;
    
    // console.log(allMeds)
    // console.log(allTakenMeds, `===`, allMissedMeds); 

    



    /*
    // final return object for getWeekIntakeStats():
    // allIntakeStats: {
        last7Days : {
            { day: 'Sat', taken: 3, total: 2, label: "3"}
            ....
            { day: 'Sat', taken: 3, total: 2, label: "3"}
        },
        yesterdayStatus : , // 'Completed / # missed'
            todayStatus: ,      // 'Completed / # missed'
            tomorrowStatus: ,   // # medications
            generalStatus: ,    // >= 90% Excellent, otherwise Needs Improvement
        }
        */
       
       // TODO: get medication intake stats for last 7 days, today, tomorrow
       
       // Need to retrieve data depending if it is previous days, today, or tomorrow:
       
    // For Previous 7 days need only:
    //   1. (taken/missed). user->medicationIntakes
    // For Today, need to get both: - subtract total with taken?? 
    //   1. (taken/missed). user->medicationIntakes
    //   2. (not yet taken/missed). medicationAlarms->notifications 
    // For Tomorrow need only:
    //   1. (not yet taken/missed) medicationAlarms->notifications 
    // const intake = await usersRef.doc(uid).collection("medicationIntakes").get().then()
    // const stats = await alarmsRef.doc(uid).collection("medicationAlarms").get()
    //     .then( async querySnapshot => {
        //         // for each alarm/medication get medication intake for last 7, today
        
        //     })
        
        //
        
        
    const allIntakeStats = {
        last7DaysStats,
        yesterdayStatus,
        todayStatus,
        tomorrowStatus,
        generalStatus
    };

    return null;
}

export {
    addMedication,
    getAllMedications,
    getCurrentMedications,
    getMedication,
    removeMedication,
    updateMedication,
    getUserName,
    getallPatients,
    getDailyMedications,
    intakeMedication,
    getTodayIntakePercentage,
    getWeekIntakeStats,
    generateIntakeDummyData,
}