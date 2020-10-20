import {rxterms} from '../assets/data/RxTermsMap'
import {firebase} from '../components/Firebase/config';

const rxCollection = firebase.firestore().collection('rxnormTerms');

/******************************************************************************/
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

// get top 10 adverse reactions from OpenFda adverse reaction API
export async function getAdverseByBnIn(brandIngredient) {
    var resourceStart = 'https://api.fda.gov/drug/event.json?search=patient.drug.openfda.brand_name:%22';
    var resourceEnd = '%22&count=patient.reaction.reactionmeddrapt.exact';
    var resource = resourceStart + brandIngredient + resourceEnd;
    console.log('resource is: ' +resource);
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