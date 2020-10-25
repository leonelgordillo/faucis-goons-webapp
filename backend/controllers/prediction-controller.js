const predictionService = require('../services/forecast-service');
const dateFormat = require('dateformat');

// EndDate: "2020-10-02T00:00:00",
// StartDate: "2020-09-27T00:00:00"

const getDatasetEndDate = async (req, res) => {

    predictionService.getWindowEndDate()
        .then((date) => {
            res.status(200).send({
                success: true,
                dataEndDate: date
            })
        })
    

}

const getForecast = async (req, res) => {

    const county = req.params.county || null
    const inputStartDate = req.params.startDate || null
    const inputEndDate = req.params.endDate || null


    if (!county || !inputStartDate || !inputEndDate) {
        res.status(400).send({
            error: true,
            message: "Missing parameters. Must include County Name, Start Date, and End Date"
        })
        return;
    }

    let startDate = new Date(inputStartDate);
    let endDate = new Date(inputEndDate);

    if ((startDate instanceof Date && isFinite(startDate)) && (endDate instanceof Date && isFinite(endDate))) {
        startDate = startDate.toISOString();
        endDate = endDate.toISOString();
    } else {
        res.status(400).send({
            error: true,
            message: "Invalid date format"
        })
        return;
    }

    if (!county.includes(" County")) {
        res.status(400).send({
            error: true,
            message: "Invalid County name format"
        })
        return;
    }


    predictionService.getDateForecast(startDate, endDate, county)
        .then((data) => {
            res.status(200).send(data.Forecast)
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({
                error: true,
                message: "Invalid County request to forecast service"
            })
        })
}

module.exports = {
    getForecast,
    getDatasetEndDate
}