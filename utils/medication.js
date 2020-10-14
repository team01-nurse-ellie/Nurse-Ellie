
/************************RxNorm Prescribable/Terms API ******************************/
// 20 requests per second per IP address
export async function getApproximateNames(name) {
    try {
        const response = await fetch('https://rxnav.nlm.nih.gov/REST/Prescribe/drugs.json?name=metoprolol');
        const body = await response.json();
        return body
    } catch  (error) {
        return error;
    }

}

// Prescribable RxNorm RESTful API
// Returns concept information for one or more specified term types(TTY).
// Ex.2 tty=IN+SCD will return all ingredients and clinical drug names
export async function getAllByConcepts(termTypes) {
    var resource = 'https://rxnav.nlm.nih.gov/REST/Prescribe/allconcepts.json?tty='
    for (var i = 0; i < termTypes.length; i++){
        if(i>0) resource += '+'
        resource += termTypes[i];
        console.log(resource);
    }
    try {
        const response = await fetch(resource);
        const body = await response.json();
        // returns long list object with all possible ingredient and brand names:
        // {name,rxcui,tty}
        var allConcepts = await body.minConceptGroup.minConcept;
        const regex = new RegExp(/[()\.[0-9]/,'i');
        var filterallConcepts = await (allConcepts[0]? allConcepts.filter(concept => concept.name.search(regex) == -1): [])
        return filterallConcepts;

    } catch  (error) { 
        return error;
    }

}

// /drugs API returns: clinical drug (SCD), clinical pack (GPCK), branded drug (SBD), branded pack (BPCK)
export async function getDrugsByTtyName(name) {
    var resource = 'https://rxnav.nlm.nih.gov/REST/Prescribe/drugs.json?name='
    resource += name;
    console.log('resource is:' +resource);
    var conceptGroups = [];
    var concepts = [];
    var scdSbd = [];
    try {
        const response = await fetch(resource);
        const body = await response.json();
        const allConceptGroups = await body.drugGroup.conceptGroup;
        console.log(allConceptGroups.length);
        for (var i = 0; i < allConceptGroups.length; i++) {
            console.log(allConceptGroups[i].conceptProperties);
            if( allConceptGroups[i].hasOwnProperty('conceptProperties') && allConceptGroups[i].tty=="SCD"){
                console.log('hello');
                scdSbd = concepts.concat(allConceptGroups[i].conceptProperties);
            } 
            if( allConceptGroups[i].hasOwnProperty('conceptProperties') && allConceptGroups[i].tty=="SBD"){
                scdSbd = concepts.concat(allConceptGroups[i].conceptProperties);
                console.log('hello2');
            }   
        }
        console.log(scdSbd);
        return await scdSbd
        

    } catch  (error) {
        return error;
    }
}

export async function getTermInfoByRxcui(rxcui) {
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

        return body
        // return object only with relevant info

    } catch  (error) { 
        return error;
    }
}

// get top 10 adverse reactions from OpenFda adverse reaction API
export async function getAdverseByBnIn(brandIngredient) {
    var resourceStart = 'https://api.fda.gov/drug/event.json?search=patient.drug.openfda.substance_name:%22';
    var resourceEnd = '%22&count=patient.reaction.reactionmeddrapt.exact';
    var resource = resourceStart + brandIngredient + resourceEnd;
    try {
        const response = await fetch(resource);
        const body = await response.json();
        // get json array from response
        const adverseTermsList = await body.results;
        return await adverseTermsList.slice(0,10);

    } catch  (error) { 
        return error;
    }

}

// get term inforation: 
export async function getTermInfoByRxcui(rxcuis) {

}

/************************OpenFDA API ***********************************************/


// get drug label information from openFDA label API
export async function getLabelByRxcui(rxcui){
    var resourceStart = 'https://api.fda.gov/drug/label.json?search=openfda.rxcui:';
    var resource = resourceStart + "%22" + rxcui + "%22";
    try {
        const response = await fetch(resource);
        const body = await response.json();
        // check that a label exists for drug product's rxcui
        if(await body.hasOwnProperty('error')) {
            await Promise.reject(new Error('openFDA did not return a label for given rxcui'));
            alert('noe1');
        // Parse "indications_and_usage" from label
        } else {
            const fdaLabel = await body.results[0];
            // check if 'indications_and_usage' is property of label
            const hasIndUsage = await fdaLabel.hasOwnProperty('indications_and_usage');
            // parse only first two sentences of 'indications_and_usage'
            if (await hasIndUsage) {
                const indUsage = await fdaLabel.indications_and_usage[0];
                const sentenceStart = await indUsage.indexOf('INDICATIONS AND USAGE') + 22;
                const firstSentenceEnd = await indUsage.indexOf('.') + 1;
                const firstIndUsageSentence = await indUsage.slice(sentenceStart,firstSentenceEnd == -1 ? indUsageSentence.length() :firstSentenceEnd );
                //const secondSentenceEnd = await nthIndex(indUsage, '.',2) + 1;
                //const secondindUsageSentence = await indUsage.slice(firstSentenceEnd, secondSentenceEnd)
                //return await (firstIndUsageSentence + secondindUsageSentence);
                console.log(firstIndUsageSentence);
                //return indUsageSentence
            } else {
                await Promise.reject(new Error('label for given rxcui did not contain indications_and_usage information'));
            }
        }
    } catch  (error) { 
        return error;
    }
}


function nthIndex(str, pat, n){
    var L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}