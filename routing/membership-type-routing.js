const express = require("express");
const membershipTypeController = require("../controllers/membership-type-controller");

const router = express.Router();

router.get("/:FK_GymID", membershipTypeController.getAllMembershipTypes);

module.exports = router;
