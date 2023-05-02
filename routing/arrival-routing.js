const express = require("express");
const arrivalController = require("../controllers/arrival-controller");

const router = express.Router();

router.get("/:clientID", arrivalController.getClientsArrivals);
router.post("/:clientID", arrivalController.checkIn);
router.put("/:clientID", arrivalController.checkOut);

module.exports = router;
