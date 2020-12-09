
const dateDifference = (endDate, startDate) => {
    const DAY_IN_MS = 1000 * 60 * 60 * 24;
    // const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    // const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((endDate - startDate) / DAY_IN_MS);
}

export {
    dateDifference  
}