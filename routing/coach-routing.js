const express = require("express");
const coachRepository = require("../controllers/coach-controller");

const router = express.Router();

router.get("/", coachRepository.getAllCoaches);
router.get("/:coachID", coachRepository.getCoachByID);
router.put("/:coachID", coachRepository.updateCoach);
router.put("/delete/:coachID", coachRepository.deleteCoach);
router.post("/", coachRepository.addNewCoach);

module.exports = router;
