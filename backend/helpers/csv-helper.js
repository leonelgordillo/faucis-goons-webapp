
const csvToJson = require("csvtojson");
const countyFips = require('../data/tx-counties-fips-mapping.json')

function convertCsvToJsonStates(csvString) {

    return csvToJson().fromString(csvString)
        .then(states => {
            console.log(states)

            const newStates = states.map((state) => {

                var newStateObj = {}

                newStateObj = state
                newStateObj['state'] = newStateObj['region']
                delete newStateObj["geo_type"];
                delete newStateObj["alternative_name"]
                delete newStateObj["sub-region"]
                delete newStateObj["region"]

                return newStateObj;
            })

            stateObj = {
                "states": newStates
            }

            return stateObj
        })

}

function convertCsvToJsonCounties(csvString) {

    return csvToJson().fromString(csvString)
        .then(counties => {
            const newCounties = counties.map((county) => {
                var newCountyObj = {}
                newCountyObj = county

                newCountyObj['fips'] = countyFips[`${county.region}`]['fips']
                newCountyObj['state'] = countyFips[`${county.region}`]['state']
                delete newCountyObj["geo_type"];
                delete newCountyObj["alternative_name"]
                delete newCountyObj["sub-region"]

                return newCountyObj;
            })

            countyObj = {
                "counties": newCounties
            }

            return countyObj;
        })

}



function addFipsToData(jsonObj) {
    const tx_mobility = jsonObj.counties

    const counties = countiesJson;

    const countiesProperties = counties.objects.collection.geometries;


    // let mappedCounties = countiesProperties 

    let filteredCounties = countiesProperties.filter((county) => {
        return county.properties.state === "Texas"
    })

    let countyFips = {}

    filteredCounties.forEach(element => {
        countyFips[`${element.properties.name} County`] = element.properties.fips.toString();
    });

    console.log(countyFips);

    const ws = fs.createWriteStream("apple-mobility-tx-counties-with-fips-with-all.json")

    let tx_mobility_with_fips = tx_mobility.map((county) => {
        let countyWithFips = county
        let countyName = county.region
        countyWithFips['fips'] = countyFips[`${countyName}`]
        countyWithFips['state'] = 'Texas'
        return countyWithFips;
    })

    console.log(tx_mobility_with_fips);

    let newCountyObj = { counties: tx_mobility_with_fips };
    ws.write(JSON.stringify(newCountyObj))

}


module.exports = {
    convertCsvToJsonStates,
    convertCsvToJsonCounties,
    addFipsToData,
}