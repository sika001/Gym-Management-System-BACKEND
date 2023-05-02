const { DateTime2 } = require("mssql");
const arrivalRepository = require("../repositories/arrival-repository");

const getClientsArrivals = async (req, res) => {
    const clientID = req.params.clientID;
    const startDate = req.body.startDate;
    let endDate = req.body.endDate;
    const currDate = DateTime2(new Date()).scale;
    if (endDate == undefined || endDate > currDate) {
        //dodati logiku da uporedi startDate i endDate
        endDate = currDate;
    }

    const result = await arrivalRepository.getClientsArrivalsQUERY(clientID, startDate, endDate);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to get arrivals times!");
    }
};

const checkIn = async (req, res) => {
    const clientID = req.params.clientID;
    const results = await arrivalRepository.checkInQUERY(clientID);

    if (results.rowsAffected == 1) {
        res.status(200).send(results);
    } else {
        res.status(400).send("Error while trying to check in a client!");
    }
};

const checkOut = async (req, res) => {
    const clientID = req.params.clientID;
    const arrivalTime = req.body.ArrivalTime;
    const results = await arrivalRepository.checkOutQUERY(clientID, arrivalTime);

    if (results.rowsAffected == 1) {
        res.status(200).send(results);
    } else {
        res.status(400).send("Error while trying to check in a client!");
    }
};
module.exports = { getClientsArrivals, checkIn, checkOut };
