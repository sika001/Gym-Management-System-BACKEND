const express = require("express");
const membershipController = require("../controllers/membership-controller");
const verifyAccessToken = require("../middlewares/verify-access-token");

const router = express.Router();

router.get("/", verifyAccessToken, membershipController.getAllMemberships);
router.get("/:clientID", verifyAccessToken, membershipController.getClientsMembership);
router.post("/", membershipController.addNewMembership);
router.put("/", verifyAccessToken, membershipController.updateExpiredMemberhsip);

module.exports = router;
