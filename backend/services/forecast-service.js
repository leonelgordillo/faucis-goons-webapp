require('dotenv');
const AWS = require('aws-sdk')


// Setting SDK region
AWS.config.update({ region: 'us-east-1' });

const forecast = new AWS.ForecastQueryService()
const forecastData = new AWS.ForecastService()

function getDateForecast(startDate, endDate, countyID) {
    const params = {
        Filters: {
            "item_id": countyID,
        },
        ForecastArn: process.env.PREDICITON_ARN,
        EndDate: endDate,
        StartDate: startDate
    }

    return new Promise((resolve, reject) => {
        forecast.queryForecast(params, (err, data) => {
            if (err) reject(err)
            resolve(data);
        })
    })
}

function getWindowEndDate() {

    const datasetArn = 'arn:aws:forecast:us-east-1:665707026409:dataset/apple_mobility_import'

    // const params = {
    //     PredictorArn: 'arn:aws:forecast:us-east-1:665707026409:predictor/simple_predictor_update'
    // }

    const params = {
        ForecastArn: process.env.PREDICITON_ARN
    }

    // return new Promise((resolve, reject) => {
    //     forecastData.getAccuracyMetrics(params, (err, data) => {
    //         if (err) reject(err)
    //         resolve(data.PredictorEvaluationResults[0]);
    //     })
    // })
    return new Promise((resolve, reject) => {
        forecastData.describeForecast(params, (err, data) => {
            if (err) reject(err);
            let predictorArn = data.PredictorArn;
            let newParams = {
                PredictorArn: predictorArn
            }
            forecastData.getAccuracyMetrics(newParams, (err, data) => {
                if (err) reject(err)
                resolve(data.PredictorEvaluationResults[0].TestWindows[1].TestWindowEnd);
            })
        })
    })
}



module.exports = {
    getDateForecast,
    getWindowEndDate
}