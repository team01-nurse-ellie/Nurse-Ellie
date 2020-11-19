const calculateLocalTimezone = (year, month = (month - 1), day, hour, minute, am_pm) => {

    try {
        
        if (month < 1 || month > 12) {
            throw new Error("Invalid months, choose months between 1 - 12");
        }
        
        if (day < 1 || day > 31) {
            throw new Error("Invalid days, choose days between 1 - 31");
        }

        if (hour < 1 || hour > 12) {
            throw new Error("Invalid hours, choose hours between 1 - 12");
        }
        
        if (minute < 0 || minute > 59) {
            throw new Error("Invalid minutes, choose minutes between 0 - 59");
        }
        
        if (am_pm !== "AM" && am_pm !== "PM") {
            throw new Error("Invalid AM/PM, choose AM or PM in uppercase");
        }

        // Date.UTC accepts the month param as 0 based (0 - 11)
        month = month - 1
        // console.log(month)

        if (am_pm == "PM") {
            if (hour < 12) {
                // 1pm - 11pm
                // console.log("hhhhhhhhhhhh")
                hour += 12;
                // console.log(hour) 
            }

            //12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,


        } else if (am_pm == "AM") {
            if (hour == 12) {
                // 12am 
                hour -= 12;
            }
        }

        // console.log(hour + "" + am_pm);
        // generates the alarm date to fetch timezone difference
        //Date.UTC is 5 hrs ahead, is in 24hr format
        // let utc = Date.UTC(year, month, day, hour, minute);
        // let utc = Date.UTC(2020, 10, 18, 0, 0);
        let date = new Date(Date.UTC(year, month, day, hour, minute));

        // 60k ms is 1 minute
        // timezone diff in millisecond
        let timezoneOffset = date.getTimezoneOffset() * 60000;

        // console.log(utc)
        // console.log(new Date(utc))
        // use timezoneoffset if only using utc one.
        let alarmDate = (Date.UTC(year, month, day, hour, minute) + timezoneOffset);
        console.log(alarmDate)
        
        // if convert to new Date() then dont use timezoneoffset????
        let d = new Date(alarmDate)
        // console.log(d)
        return d;
        // console.log(new Date(Date.UTC(2020, 10, 18, 0, 5)))



    } catch (error) {
        throw (error);
    }

}

export {
    calculateLocalTimezone
}