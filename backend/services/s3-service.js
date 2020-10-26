// Dependencies
require('dotenv')
const AWS = require('aws-sdk')

// Setting SDK region
AWS.config.update({ region: 'us-east-2' });

// Creating S3 Object
const s3 = new AWS.S3;
const datasetsBucketName = `${process.env.S3_DATASET}`;
const assetsBucketName = `${process.env.S3_ASSETS}`;

function downloadDatasetFile(filePath) {
    const params = {
        Bucket: datasetsBucketName,
        Key: filePath
    }

    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}

function downloadAssetFile(filePath) {
    const params = {
        Bucket: assetsBucketName,
        Key: filePath
    }

    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}

module.exports = {
    downloadDatasetFile,
    downloadAssetFile
}


