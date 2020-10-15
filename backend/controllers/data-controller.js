// Dependencies
require('dotenv')
const athenaExpress = require('../services/athena-service').athenaExpress;

const query = `
SELECT * FROM covid_testing_us_daily WHERE date = '20200819' limit 10;`

function getQueryResults(req, res, next) {
    athenaExpress
        .query(query)
        .then(results => {
            console.log(results);
            res.status(200).json(results)
        })
        .catch(error => {
            console.log(error);
            res.status(401)
        });
}

module.exports = {
    getQueryResults
}