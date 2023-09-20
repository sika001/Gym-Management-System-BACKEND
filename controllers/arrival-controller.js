const { DateTime2 } = require("mssql");
const arrivalRepository = require("../repositories/arrival-repository");

const getClientsArrivals = async (req, res) => {
    const clientID = req.params.clientID;
    const startDate = req.body.startDate;
    let endDate = req.body.endDate;
    const currDate = DateTime2(new Date()).scale;
    if (endDate === undefined || endDate > currDate) {
        endDate = currDate;
    }

    const result = await arrivalRepository.getClientsArrivalsQUERY(clientID, startDate, endDate);
    console.log("ARRIVALS SINCE : ", startDate, " TILL: ", endDate,"," , result);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to get arrivals times!");
    }
};

const getAllClientsAtGym = async (req, res) => {
    const result = await arrivalRepository.getAllClientsAtGymQUERY();

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to get clients that are currently at gym!");
    }
};

const getClientsDailyAVGTimeAtGym = async (req, res) => {
    const startDate = req.body.startDate;
    let endDate = req.body.endDate;
    const currDate = DateTime2(new Date()).scale;
    if (endDate === undefined || endDate > currDate) {
        endDate = currDate;
    }
    // console.log("startDate: ", startDate, " endDate: ", endDate);
    const result = await arrivalRepository.getClientsDailyAVGTimeAtGymQUERY(startDate, endDate);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to get clients daily average time at gym!");
    }
};


const checkIn = async (req, res) => {
    const clientID = req.body.FK_ClientID;
    const results = await arrivalRepository.checkInQUERY(clientID);

    if (results.rowsAffected == 1) {
        res.status(200).send(results);
    } else {
        res.status(400).send("Error while trying to check in a client!");
    }
};

const checkOut = async (req, res) => {
    const clientID = req.body.FK_ClientID;
    const results = await arrivalRepository.checkOutQUERY(clientID);

    if (results.rowsAffected[0] === 1) {
        res.status(200).send(results);
    } else {
        res.status(400).send("Error while trying to check in a client!");
    }
};

module.exports = { 
                   getClientsArrivals, 
                   getAllClientsAtGym, 
                   getClientsDailyAVGTimeAtGym,
                   checkIn, 
                   checkOut 
                };
