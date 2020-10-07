// Dependencies
require('dotenv')
const aws = require('aws-sdk')
const _ = require('lodash')
const AthenaExpress = require('athena-express');

// Setting SDK region
aws.config.update({ region: 'us-east-2' });

// Athena options
const ATHENA_DB = 'covid-19';
const ATHENA_OUTPUT_LOCATION = 's3://fgoons-queryresults-dev/results-from-api/';


 
// Setting Athena configurations
const athenaExpressConfig = {
    aws: aws,
    s3: ATHENA_OUTPUT_LOCATION,
    db: ATHENA_DB,
    formatJson: true, /* optional default=true */
}; //configuring athena-express with AWS sdk object

// Initializing Athena
const athenaExpress = new AthenaExpress(athenaExpressConfig);

const query = `
SELECT * FROM covid_testing_us_daily limit 10
WHERE date = '20200819';
`

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