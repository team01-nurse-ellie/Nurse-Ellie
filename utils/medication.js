export async function getRxnowApproximateNames(name) {
    try {
        const response = await fetch('https://rxnav.nlm.nih.gov/REST/Prescribe/drugs.json?name=metoprolol');
        const body = await response.json();
        return body
    } catch  (response) {
        reject()
    }

}

// Prescribable RxNorm RESTful API
// Returns concept information for one or more specified term types(TTY).
// Ex.2 tty=IN+SCD will return all ingredients and clinical drug names
export async function getRxnowAllByConcepts(termTypes) {
    var resource = 'https://rxnav.nlm.nih.gov/REST/Prescribe/allconcepts.json?tty='
    for (var i = 0; i < termTypes.length; i++){
        if(i>0) resource += '+'
        resource += termTypes[i];
        console.log(resource);
    }
    try {
        const response = await fetch(resource);
        const body = await response.json();
        // get json array from response
        const allConcepts = await body.minConceptGroup.minConcept;
        // minConcept: {name,rxcui,tty}
        //console.log(allConcepts)
        return body

    } catch  (response) { // error message, reject()?
        //reject()
    }

}

export async function getRxNowDrugsByTtyName(name) {
    // /drugs API returns: clinical drug (SCD), clinical pack (GPCK), branded drug (SBD), branded pack (BPCK)
    var resource = 'https://rxnav.nlm.nih.gov/REST/Prescribe/drugs.json?name='
    resource += name;
    console.log(resource);
    try {
        const response = await fetch(resource);
        const body = await response.json();
        // get json array from response
        const allDrugs = await body.drugGroup;
        // BPCK -> GPCK-> SBD -> SCD
        // array of results, ie SCD drug products

        const scd = await body.drugGroup.conceptGroup[3].conceptProperties;
        const sbd = await body.drugGroup.conceptGroup[2].conceptProperties;
        const scdSbd = await scd.concat(sbd);
        //console.log(scd);
        //console.log(sbd==undefined);
        console.log(scdSbd);
        // body drugGroup.conceptgroup -> [array of tty objects]:
            // [ {BPCK}{GPCK}{SBD}{SCD} ]   -> take {SCD} from array tty objects
            // {"tty":"SCD",    "conceptProperties":[array of results ]   }:
            // each result object: rxcui, name(concept, ie scd), synonym, tty, language, suppress, umlscui

        return body
        

    } catch  (response) { // error message, reject()?
        //reject()
    }
}

export async function getRxNowTermInfoByRxcui(rxcui) {
    var resourceStart = 'https://rxnav.nlm.nih.gov/REST/RxTerms/rxcui/'
    var resourceEnd = '/allinfo.json';
    var resource = resourceStart + rxcui + resourceEnd;
    try {
        const response = await fetch(resource);
        const body = await response.json();
        // get json array from response
        const rxcuiInfo = await body.rxtermsProperties;
        // brandName will be empty if generic (SCD)
        // displayName will be BN + (form) if brand, else IN + (form)
        // fulll genericName is never empty wethere SCD|SBD
        // fullName will + [brandname] if brand
        console.log(rxcuiInfo);

        return body
        // return object only with relevant info

    } catch  (response) { // error message, reject()?
        //reject()
    }
}