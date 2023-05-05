const workoutRepository = require("../repositories/workout-repository");

const getAllWorkoutPrograms = async (req, res, next) => {
    const results = await workoutRepository.getAllWorkoutProgramsQUERY();

    if (results) {
        res.status(200).send(results);
    } else {
        res.status(400).send("Error while trying to get all workout programs!");
    }
};

const addNewMembershipType = async (req, res) => {
    const membership = req.body;
    const result = await workoutRepository.addNewMembershipTypeQUERY(membership);

    if (result) {
        res.status(201).send(result);
    } else {
        res.status(400).send("Cannot insert a membership into a database!");
    }
};

module.exports = { getAllWorkoutPrograms, addNewMembershipType };
