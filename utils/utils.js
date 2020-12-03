export function dateFromToday(days) {
    var start = new Date();
    var end = new Date();
    start.setDate(start.getDate() - days);
    // return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


export function getValueFormatted(value) {
    const hourValue = HOURS_DATA[getIndexForHourPicker(value)];
    const minuteValue = MINUTES_DATA[getIndexForMinutePicker(value)];
    const ampmValue = AMPM_DATA[getIndexForAMPMPicker(value)];
    return `${hourValue}:${minuteValue} ${ampmValue}`;
}
const HOURS_DATA = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
const MINUTES_DATA = Array.from({ length: 60 }, (_, i) => i < 10 ? `0${i}` : String(i));
const AMPM_DATA = ['AM', 'PM'];
function getIndexForHourPicker(value) {
    return Math.floor((value % 43200) / 3600);
}
function getIndexForMinutePicker(value) {
    return Math.floor((value % 3600) / 60);
}
function getIndexForAMPMPicker(value) {
    return Math.floor(value / 43200);
}