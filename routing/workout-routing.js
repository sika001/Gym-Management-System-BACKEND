const express = require("express");
const workoutController = require("../controllers/workout-controller");

const router = express.Router();

router.get("/", workoutController.getAllWorkoutPrograms);
router.post("/", workoutController.addNewMembershipType);

module.exports = router;
