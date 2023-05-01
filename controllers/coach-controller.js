const coachRepository = require("../repositories/coach-repository");

const getAllCoaches = async (req, res) => {
    const coaches = await coachRepository.getAllCoachesQUERY();

    if (coaches) {
        res.status(200).send(coaches);
    } else {
        res.status(200).send("Error while trying to get all clients!");
    }
};

const getCoachByID = async (req, res) => {
    const coachID = req.params.coachID;
    const coach = await coachRepository.getCoachByID_QUERY(coachID);

    if (coach) {
        res.status(200).send(coach);
    } else {
        res.status(400).send("Error while trying to get coach by ID!");
    }
};

const addNewCoach = async (req, res) => {
    const coach = req.body;
    const result = await coachRepository.addNewCoachQUERY(coach);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to add a new coach!");
    }
};

const updateCoach = async (req, res) => {
    const coachID = req.params.coachID;
    const coach = req.body;
    const result = await coachRepository.updateCoachQUERY(coachID, coach);

    if (result.rowsAffected == 1) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to update a client!");
    }
};

const deleteCoach = async (req, res) => {
    const coachID = req.params.coachID;
    const result = await coachRepository.deleteCoachQUERY(coachID);

    if (result.rowsAffected == 1) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to delete a client!");
    }
};
module.exports = { getAllCoaches, getCoachByID, addNewCoach, updateCoach, deleteCoach };
