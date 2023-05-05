const express = require("express");
const membershipController = require("../controllers/membership-controller");

const router = express.Router();

router.get("/", membershipController.getAllActiveMemberships);
router.get("/:clientID", membershipController.getClientsInactiveMemberships);
router.post("/", membershipController.addNewMembership);
router.put("/", membershipController.updateExpiredMemberhsip);

module.exports = router;
