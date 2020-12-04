import * as Notifications from 'expo-notifications';

const scheduleNotifications = async (medicationToAdd, medicationDocID, timestamp, selectDoW, firstName = null) => {
  console.log('shcedule notifications first name: ' + firstName);
    try {
      console.log(`***SCHEDULING ALARMS***`);
      // calculateLocalTimezone(year, month, day, scheduledTime.hour, scheduledTime.minute, scheduledTime.AM_PM);
      // 1 day - 86400000ms
      let oneDay = 86400000;
      let daysToSchedule = [];
      let notifications = [];
      
      for (let i = timestamp.startDate; i <= timestamp.endDate; i += oneDay) {
        let date = new Date(i);
        if (selectDoW.includes(date.getDay())) {
          daysToSchedule.push(i);
        }
      }

      const content = {
        title: `${firstName}, it's time to take your ${medicationToAdd.nameDisplay}.`,
        body: `Please check-in if you have taken this medication.`,
      };
      
      for (let i = 0; i < daysToSchedule.length; i++) {
        await Notifications.scheduleNotificationAsync({ content, trigger: daysToSchedule[i] }).then(notificationID => {
          notifications.push({
            id: notificationID,
            trigger: daysToSchedule[i],
            rxcui: medicationToAdd.rxcui,
            medicationID: medicationDocID
          });
        }).catch(error => { throw error; });
      }
    
      const alarm = {
        content,
        notifications
      }
    
      return alarm;

    } catch (error) { throw error; }

  };

  export {
      scheduleNotifications
  }