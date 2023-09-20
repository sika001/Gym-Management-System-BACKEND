const express = require("express");
const scheduleController = require("../controllers/schedule-controller");

const router = express.Router();

router.post("/", scheduleController.addNewEvent);
router.put("/", scheduleController.updateEvent);
router.delete("/:ScheduleID", scheduleController.deleteEvent);

module.exports = router;
