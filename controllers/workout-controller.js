const workoutRepository = require("../repositories/workout-repository");

const getAllWorkoutPrograms = async (req, res, next) => {
    const results = await workoutRepository.getAllWorkoutProgramsQUERY();

    if (results) {
        res.status(200).send(results);
    } else {
        res.status(400).send("Error while trying to get all workout programs!");
    }
};

const addNewWorkoutPrograms = async (req, res) => {
    const workout = req.body;
    const result = await workoutRepository.addWorkoutProgramQUERY(workout);

    if (result) {
        res.status(201).send(result);
    } else {
        res.status(400).send("Cannot insert a new workout into a database!");
    }
};

const deleteWorkoutProgram = async (req, res) => {
    const workoutID = req.params.workoutID;
    const result = await workoutRepository.deleteWorkoutProgramQUERY(workoutID);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to delete a workout program!");
    }
};


module.exports = { getAllWorkoutPrograms, addNewWorkoutPrograms, deleteWorkoutProgram };
