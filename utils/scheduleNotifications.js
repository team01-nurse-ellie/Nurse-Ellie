import * as Notifications from 'expo-notifications';

const scheduleNotifications = async (medicationToAdd, timestamp, selectDoW, firstName = null) => {

    try {
      console.log(`***SCHEDULING ALARMS***`);
      let oneDay = 86400000;
      let daysToSchedule = [];
      let notifications = [];
      
      // console.log(`===== schedle ===== `);
      // console.log(scheduledTime)
      // console.log(timestamp)
      // console.log(selectDoW)
      // console.log(`===== schedle ===== `);
      // calculateLocalTimezone(year, month, day, scheduledTime.hour, scheduledTime.minute, scheduledTime.AM_PM);

      // 1 day - 86400000ms
      for (let i = timestamp.startDate;  i <= timestamp.endDate; i += oneDay) {
        // console.log(new Date(i));
        let date = new Date(i);
        // console.log(date.getDay());
        if (selectDoW.includes(date.getDay())) {
          daysToSchedule.push(i);
        }
        // console.log(date.getUTCDay());
      }

      // console.log(daysToSchedule);

      const content = {
        title: `${firstName}, it's time to take your ${medicationToAdd.nameDisplay}.`,
        body: `Please check-in if you have taken this medication.`,
      };

      // console.log(content);
      
      for (let i = 0; i < daysToSchedule.length; i++) {
        // console.log(daysToSchedule[i])
        await Notifications.scheduleNotificationAsync({ content, trigger: daysToSchedule[i] }).then(notificationID => {
          notifications.push({
            id: notificationID,
            trigger: daysToSchedule[i]
          });
        });
      }
      // console.log(notifications)
    
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