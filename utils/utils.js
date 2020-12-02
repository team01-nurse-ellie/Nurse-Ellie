export function dateFromToday(days) {
    var start = new Date();
    var end = new Date();
    start.setDate(start.getDate() - days);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}