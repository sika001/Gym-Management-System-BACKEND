const express = require("express");
const workoutController = require("../controllers/workout-controller");
const verifyAccessToken = require("../middlewares/verify-access-token");

const router = express.Router();

router.get("/", workoutController.getAllWorkoutPrograms);
router.post("/", verifyAccessToken, workoutController.addNewWorkoutPrograms);
router.delete("/:workoutID", verifyAccessToken, workoutController.deleteWorkoutProgram);

module.exports = router;
