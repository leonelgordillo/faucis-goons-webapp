// Dependencies
require('dotenv')
const aws = require('aws-sdk')
const _ = require('lodash')
const AthenaExpress = require('athena-express');

// Setting SDK region
aws.config.update({ region: 'us-east-2' });

// Athena options
const ATHENA_DB = process.env.ATHENA_DB;
const ATHENA_OUTPUT_LOCATION = process.env.ATHENA_OUTPUT_S3;


// Setting Athena configurations
// configuring athena-express with AWS sdk object
const athenaExpressConfig = {
    aws: aws,
    s3: ATHENA_OUTPUT_LOCATION,
    db: ATHENA_DB,
    formatJson: true, /* optional default=true */
}; 

// Initializing Athena
const athenaExpress = new AthenaExpress(athenaExpressConfig);


module.exports = {
    athenaExpress
}