const scheduleRepository = require("../repositories/schedule-repository");

const addNewEvent = async (req, res) => {
    const event = req.body;
    // console.log("Event:", event);
    const result = await scheduleRepository.addNewEventQUERY(event);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to add a new event!");
    }
};

const updateEvent = async (req, res) => {
    const event = req.body;

    // console.log("Event Info for updating:", event);
    const result = await scheduleRepository.updateEventQUERY(event);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to update an event!");
    }
};

const deleteEvent = async (req, res) => {
    const ScheduleID = req.params.ScheduleID;
    
    const result = await scheduleRepository.deleteEventQUERY(ScheduleID);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to delete an event!");
    }

};

module.exports = { addNewEvent, updateEvent, deleteEvent };
