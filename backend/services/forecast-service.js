require('dotenv');
const forecastExport = require('../data/forecast-export-10-25-20.json');
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

            let avgMobility = getAvgMobility(startDate, endDate, countyID);
            let response = {
                data: data,
                avgMobility: avgMobility
            }
            console.log(response)
            resolve(response);
        })
    })
}

function getWindowEndDate() {

    return new Promise((resolve, reject) => {
        forecastData.listDatasetImportJobs({}, (err, data) => {
            if (err) reject(err);
            if (data.DatasetImportJobs[0].DatasetImportJobArn) {
                let importJobArn = data.DatasetImportJobs[0].DatasetImportJobArn
                let params = {
                    DatasetImportJobArn: importJobArn
                }
                forecastData.describeDatasetImportJob(params, (err, data) => {
                    if (err) reject(err)
                    resolve(data.FieldStatistics.timestamp.Max);
                })
            } else {
                reject("Unable to get predictor ARN")
            }
        })
    })
}

function getAvgMobility(startDate, endDate, countyID) {

    let startTime = new Date(startDate).getTime()
    let endTime = new Date(endDate).getTime()

    let forecastExportData = forecastExport

    let filteredByDate = forecastExportData.filter((dataPoint) => {
        let dateTime = new Date(dataPoint.date).getTime()
        return dateTime >= startTime && dateTime <= endTime;
    })

    let key = 'item_id'

    let p10MobilityMapping = filteredByDate.reduce((result, currentValue) => {
        if (!result[currentValue[key]]) {
            result[currentValue[key]] = [];
        }

        result[currentValue[key]].push(currentValue.p10);

        return result
    }, {})



    let avgMobilityMapping = {}

    Object.keys(p10MobilityMapping).map(function (key, index) {
        let p10Arr = p10MobilityMapping[key]
        let sum = 0;

        for (let i = 0; i < p10Arr.length; i++) {
            sum += Number(p10Arr[i])
        }

        avgMobilityMapping[key] = sum / p10Arr.length
    })

    let sortable = [];

    for (var county in avgMobilityMapping) {
        sortable.push([county, avgMobilityMapping[county]]);
    }

    sortable.sort((a, b) => {
        return b[1] - a[1]
    })


    let sortedObj = {}

    sortable.forEach(function (item, index) {
        sortedObj[item[0]] = {
            'avg': item[1],
            'ranking': index + 1
        }

    })

    return sortedObj[countyID];

}



module.exports = {
    getDateForecast,
    getWindowEndDate
}