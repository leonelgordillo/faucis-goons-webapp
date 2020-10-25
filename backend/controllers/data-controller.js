// Dependencies
require('dotenv')

const s3Service = require('../services/s3-service');
const helper = require('../helpers/csv-helper');
const fs = require('fs')


const getTxMobilityJson = async (req, res) => {

    fileKey = `apple-mobility-adx/apple-mobility-trends_tx_counties.csv`;

    let datasetFile;
    let txMobilityJson;
    let localFilepath = `./data/tx-mobility-data.json`;

    if (fs.existsSync(localFilepath)) {
        datasetFile = fs.readFileSync(localFilepath);
        console.log("Found local dataset file")
        txMobilityJson = JSON.parse(datasetFile.toString())
    } else {
        const s3Response = await s3Service.downloadDatasetFile(fileKey);
        let csvString = s3Response.Body.toString();
        if (!fs.existsSync("./data/")) {
            fs.mkdirSync("./data")
        }
        txMobilityJson = await helper.convertCsvToJsonCounties(csvString)
        const ws = fs.createWriteStream(localFilepath);
        ws.write(JSON.stringify(txMobilityJson), (err) => {
            if(err) {
                console.error(err);
                res.status(400).send({
                    success: false,
                    error: err
                })
                return;
            } 

        });
    }
    res.status(200).send(txMobilityJson);


}

const getUsMobilityJson = async (req, res) => {

    fileKey = `apple-mobility-adx/apple-mobility-trends_usa_states.csv`;

    let datasetFile;
    let usMobilityJson;
    let localFilepath = `./data/us-mobility-data.json`;

    if (fs.existsSync(localFilepath)) {
        datasetFile = fs.readFileSync(localFilepath);
        console.log("Found local dataset file")
        usMobilityJson = JSON.parse(datasetFile.toString())
    } else {
        const s3Response = await s3Service.downloadDatasetFile(fileKey);
        let csvString = s3Response.Body.toString();
        if (!fs.existsSync("./data/")) {
            fs.mkdirSync("./data")
        }
        usMobilityJson = await helper.convertCsvToJsonStates(csvString)
        const ws = fs.createWriteStream(localFilepath);
        ws.write(JSON.stringify(usMobilityJson), (err) => {
            if(err) {
                console.error(err)
                res.status(400).send({
                    success: false,
                    error: err.message
                })
            }
        });
    }
    res.status(200).send(usMobilityJson);

}



module.exports = {
    getTxMobilityJson,
    getUsMobilityJson
}