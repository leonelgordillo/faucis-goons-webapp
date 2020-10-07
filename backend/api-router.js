const express = require('express');
const assetsController = require('./controllers/assets-controller');
const dataController = require('./controllers/data-controller');

function apiRouter() { 

    const router = express.Router();

    // Asset Controller Routes
    // router.get('/assets/:path', assetsController.getAsset);

    // Data Controller Routes
    router.get('/data', dataController.getQueryResults)

    return router;
}

module.exports = apiRouter;