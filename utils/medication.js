// medication.js
import {firebase} from '../components/Firebase/config';

const rxCollection = firebase.firestore().collection('rxnormTerms');

/* Drug (rxcui) With Info
   Example: Monopril 10mg
        Object {
        "adverseEvents": Array [],
        "doseForm": "Tab",
        "doseFormRxn": "Oral Tablet",
        "information": "",
        "nameBrand": "Monopril",
        "nameDisplay": "Monopril",
        "nameFullGeneric": "fosinopril sodium 10 MG Oral Tablet",
        "namePrescribe": "Monopril 10 MG Oral Tablet",
        "route": "Oral Pill",
        "rxcui": 857171,
        "rxcuiGeneric": 857169,
        "strength": "10 mg",
        "tty": "SBD",
        }
*/
/*********************RxNorm Prescribable/Terms API calls**********************/
/*********************20 requests per second per IP address*******************/

// returns RxTerms term info for each rxcui
export async function getDrugsByIngredientBrand(ingredientBrand) {
    try {
        if (ingredientBrand == undefined) {throw "search term undefined"};
        console.log('get all drugs for: ' + ingredientBrand);
        // list of rxcui of drugs by ingredient or brand
        var rxcuis = await getRxcuisByIngredientBrand(ingredientBrand);
        // term info and adverse reaction for list of rxcuis
        var rxcuisWithInfo = await getRxcuisInfo(rxcuis, ingredientBrand);
        // get indications and usage from openFDA API
        for (var drug of rxcuisWithInfo) {
            const indication = await getIndUseByRxcui(drug.rxcui);
            indication instanceof Error? '': drug.information = indication;
        }
        // Return array of drug objects. For object structure example above: "Drug (rxcui) With Info"
        return rxcuisWithInfo;
    } catch  (error) {
        return error;
    }
}
// get drug product rxcuis for an ingredient/brand-name
export async function getRxcuisByIngredientBrand(ingredientBrand) {
        var resource = 'https://rxnav.nlm.nih.gov/REST/Prescribe/drugs.json?name='
        resource += ingredientBrand;
        console.log('resource is:' +resource);
        var concepts = [];
        var scdSbd = [];
        var rxcuis = [];
        try {
            const response = await fetch(resource);
            const body = await response.json();
            const allConceptGroups = await body.drugGroup.conceptGroup;
            for (var i = 0; i < allConceptGroups.length; i++) {
                if( allConceptGroups[i].hasOwnProperty('conceptProperties') && allConceptGroups[i].tty=="SCD"){
                    scdSbd = concepts.concat(allConceptGroups[i].conceptProperties);
                } 
                if( allConceptGroups[i].hasOwnProperty('conceptProperties') && allConceptGroups[i].tty=="SBD"){
                    scdSbd = concepts.concat(allConceptGroups[i].conceptProperties);
                }   
            }
            scdSbd.forEach(e=>rxcuis.push(e.rxcui));
            return rxcuis;
        } catch  (error) {
            return error;
        }
}
// get all information for rxcui (term info, adverse reactions)
async function getRxcuisInfo(rxcuis,ingredientBrand) {
    // get term info
    var rxcuisTermInfo = await getRxcuisTermInfo(rxcuis);
    try {
    // get adverse event list by ingredient/brand
    const adverseTermsList = await getAdverseByBnIn(ingredientBrand);
        // append adverse reaction to all rxcui
        for (var element of rxcuisTermInfo) {
            element.adverseEvents = adverseTermsList;
        }
    // get label information
    for (var element of rxcuisTermInfo) {
        element.information = '';
    }
    //
    } catch (error) {
        return error;
    }
    return rxcuisTermInfo;
}

// get term information for all rxcuis
async function getRxcuisTermInfo(rxcuis) {
    var rxcuisTermInfo = [];
    if(rxcuis != undefined) {
        var rxcui;
        for (const element of rxcuis) {
/*             rxcui = rxterms[element];
            if (rxcui != undefined) rxcuisTermInfo.push(parseRxcuiTermInfo(rxcui)); */
/*             const rxcui = await rxCollection.where('RXCUI', '==', element).get().then(querySnapshot => {
                querySnapshot.forEach(e => {
                    console.log(e.data());
                });
            }); */
            await rxCollection.doc(element).get().then(doc => rxcuisTermInfo.push(parseRxcuiTermInfo(doc.data())));
        }
    }
    return rxcuisTermInfo;

}

// parse relevant properties from rxcui term info
// https://mor.nlm.nih.gov/RxTerms/
 function parseRxcuiTermInfo(termInfo) {
    var medication = {}
    // [brand name]
    medication.nameBrand = titleCase(termInfo.BRAND_NAME);
    // [brand name|chemical] ([route])
    medication.nameDisplay = titleCase((termInfo.DISPLAY_NAME).substring(0,(termInfo.DISPLAY_NAME.indexOf('('))-1));
    // [chemical] [strength] [rxn dose form] [[brand name]]
    medication.nameFullGeneric = termInfo.FULL_GENERIC_NAME;
    // rxcui of generic equivalent
    medication.rxcuiGeneric = termInfo.GENERIC_RXCUI;
    // form derived from rxnom dose form
    medication.doseForm = termInfo.NEW_DOSE_FORM;
    // rxnorm dose form
    medication.doseFormRxn = termInfo.RXN_DOSE_FORM;
    // concept rxcui
    medication.rxcui = termInfo.RXCUI;
    // route
    medication.route = termInfo.ROUTE;
    // rxnorm prescribable name
    medication.namePrescribe = termInfo.PSN;
    // strength
    medication.strength = termInfo.STRENGTH;
    // term type. SBD=branded drug, SCD=clinical drug(non-brand)
    medication.tty = termInfo.TTY;
    return medication;
}

// Returns concept information for one or more specified term types(TTY).
export async function getAllByConcepts(termTypes) {
    var resource = 'https://rxnav.nlm.nih.gov/REST/Prescribe/allconcepts.json?tty='
    for (var i = 0; i < termTypes.length; i++){
        if(i>0) resource += '+'
        resource += termTypes[i];
    }
    //console.log(resource);
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

/*
export async function getTermInfoByRxcui(rxcui) {
    var resourceStart = 'https://rxnav.nlm.nih.gov/REST/RxTerms/rxcui/'
    var resourceEnd = '/allinfo.json';
    var resource = resourceStart + rxcui + resourceEnd;
    try {
        const response = await fetch(resource);
        const body = await response.json();
        // get json array from response
        const rxcuiInfo = await body.rxtermsProperties;
        return body

    } catch  (error) { 
        return error;
    }
}
*/
/*
export async function getApproximateNames(name) {
    try {
        const response = await fetch('https://rxnav.nlm.nih.gov/REST/Prescribe/drugs.json?name=metoprolol');
        const body = await response.json();
        return body
    } catch  (error) {
        return error;
    }
}
*/


/******************************************************************************/
/*************************** OpenFDA API **************************************/

// get drug label 'indications and usage' information from openFDA label API
export async function getIndUseByRxcui(rxcui){
    var resourceStart = 'https://api.fda.gov/drug/label.json?search=openfda.rxcui:';
    var resource = resourceStart + "%22" + rxcui + "%22";
    //console.log(resource);
    console.log(rxcui + ' rxcui start');
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
            var hasIndUsage = await fdaLabel.hasOwnProperty('indications_and_usage');
            // parse only first two sentences of 'indications_and_usage'
            if (await hasIndUsage) {
                var indUsage = await fdaLabel.indications_and_usage[0];
                //console.log('ind usage raw: ' + indUsage);
                const sentenceStart = indUsage.indexOf('INDICATIONS AND USAGE') + 22;
                //console.log(rxcui + ' sentence start ' + sentenceStart);
                var sentenceEnd;
                // Indications and usage can be pages long, get substring
                indUsage = indUsage.substr(0,250);
                //console.log(rxcui + ' ind 250: ' + indUsage);
                // Find sentence markers: first '.', first '[', or second ')'
                var periodIndex = indUsage.indexOf('.') + 1;
                //console.log(rxcui + ' period index: ' + periodIndex);
                var parenthesisIndex = nthIndex(indUsage,')',2) + 1;
                //console.log(rxcui + ' parenthesis index :' + parenthesisIndex);
                var bracketIndex = nthIndex(indUsage,'[',1) -1;
                //console.log(rxcui + ' bracket index: ' + bracketIndex);
                var andIndex = nthIndex(indUsage,'and',1) - 1;
                //console.log(rxcui + ' andindex: ' + andIndex);
                // determine appropriate marker to truncate 'one' sentence
                if (periodIndex == 0 || bracketIndex < periodIndex) { // '.' does not separating sentence
                    sentenceEnd = bracketIndex > sentenceStart ? bracketIndex : parenthesisIndex;
                    sentenceEnd = sentenceEnd < 1 ? andIndex : sentenceEnd;
                } else { // other than above special cases, 'one' sentence is up to first '.'
                    sentenceEnd = periodIndex;
                }
                //console.log(rxcui + ' sentence end check 1 ' + sentenceEnd);
                // if none of the sentence markers found, return entire 250 characters
                sentenceEnd = sentenceEnd <= sentenceStart ? indUsage.length : sentenceEnd;
                //console.log(rxcui + ' sentence end check 2 ' + sentenceEnd);
                //console.log(rxcui + ' 250 length: ' + indUsage.length);
                var firstIndUsageSentence = indUsage.slice(sentenceStart, sentenceEnd);
                //console.log(rxcui + ' final: ' + firstIndUsageSentence);
                return firstIndUsageSentence
            } else {
                await Promise.reject(new Error('label for given rxcui did not contain indications_and_usage information'));
            }
        }
    } catch  (error) { 
        return error;
    }
}

// get top 10 adverse reactions from OpenFda adverse reaction API
export async function getAdverseByBnIn(brandIngredient) {
    var resourceStart = 'https://api.fda.gov/drug/event.json?search=patient.drug.openfda.brand_name:%22';
    var resourceEnd = '%22&count=patient.reaction.reactionmeddrapt.exact';
    var resource = resourceStart + brandIngredient + resourceEnd;
    //console.log('resource is: ' +resource);
    try {
        const response = await fetch(resource);
        const body = await response.json();
        // get json array from response
        const results = await body.results;
        var adverseTermsList = await ((typeof results == 'undefined')? [] :results.slice(0,20));
        var list = [];
        for (var element of adverseTermsList) {
            list.push(titleCase(element.term));
        }
        return list;
    } catch  (error) { 
        return error;
    }
}


/******************************************************************************/
/*****************************  Helper functions*******************************/

// find n'th corrence of pat in str
function nthIndex(str, pat, n){
    var L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

function titleCase(string) {
    if (string){
        var sentence = string.toLowerCase().split(" ");
        for(var i = 0; i< sentence.length; i++){
            sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
        }
        return sentence.join(" ");
    } else {
        return '';
    }
}