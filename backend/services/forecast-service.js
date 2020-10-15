const AWS = require('aws-sdk')

// Setting SDK region
AWS.config.update({ region: 'us-east-1' });

const forecast = new AWS.ForecastQueryService()

function getDateForecast(startDate, endDate, countyID) {
    const params = {
        Filters: {
            "item_id": countyID,
        },
        ForecastArn: "arn:aws:forecast:us-east-1:665707026409:forecast/simple_forecast",
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

module.exports = {
    getDateForecast
}