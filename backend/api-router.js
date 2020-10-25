const express = require('express');
const s3Controller = require('./controllers/s3-controller');
const dataController = require('./controllers/data-controller');
const predictionController = require('./controllers/prediction-controller');

function apiRouter() { 

    const router = express.Router();

    // S3 Download Controller Routes
    router.get('/assets/bodymovin/:folderName', s3Controller.getBodymovinAsset);
    router.get('/datasets/mobility/:region', s3Controller.getDataset)


    // Database Controller Routes
    router.get('/data/tx-mobility', dataController.getTxMobilityJson)
    router.get('/data/us-mobility', dataController.getUsMobilityJson)

    // AWS Forcast Controller Routes
    router.get('/prediction/:county/:startDate/:endDate', predictionController.getForecast)


    return router;
}

module.exports = apiRouter;