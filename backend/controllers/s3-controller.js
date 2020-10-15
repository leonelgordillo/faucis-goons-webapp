const s3Service = require('../services/s3-service');
const fs = require('fs');
const path = require('path')


const getBodymovinAsset = async (req, res) => {

    const bodymovinFolder = req.params.folderName;
    const fileKey = `assets/bodymovin-exports/${bodymovinFolder}/data.json`
    const assetFile = await s3Service.downloadAssetFile(fileKey);
    res.status(200).json(assetFile);
}

const getDataset = async (req, res) => {

    const region = req.params.region;
    let fileKey;

    switch (region) {
        case 'tx':
            fileKey = `apple-mobility-trends-reports/dataset/apple-mobility-tx-counties-with-all.json`
        break;
        case 'us':
            fileKey = `apple-mobility-trends-reports/dataset/apple-mobility-us.json`
        break;
        default:
            res.status(400).send({
                error: true,
                message: "Invalid region passed into request. Valid choices are either 'tx' or 'us'"
            })
            return;
    }

    let datasetFile;
    let localFilepath = `./data/${region}-mobility-data.json`;

    if (fs.existsSync(localFilepath)) {
        datasetFile = fs.readFileSync(localFilepath);
        console.log("Found local dataset file")
    }
    else {
        const s3Response = await s3Service.downloadDatasetFile(fileKey);
        datasetFile = s3Response.Body;
        if (!fs.existsSync("./data/")) {
            fs.mkdirSync("./data")
        }
        const ws = fs.createWriteStream(localFilepath);
        ws.write(datasetFile, (err) => {
            if(err) console.error(err);
        });
        console.log("Downloaded S3 dataset file")
    }

    if (datasetFile) {
        let datasetJson = JSON.parse(datasetFile.toString('utf-8'));
        console.log(datasetJson);
        res.status(200).json(datasetJson);
    }
    else {
        res.status(400).send({
            error: true,
            message: "Unable to send dataset file"
        });
    }




}


module.exports = {
    getBodymovinAsset,
    getDataset
}