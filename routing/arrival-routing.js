const express = require("express");
const arrivalController = require("../controllers/arrival-controller");

const router = express.Router();

router.get("/", arrivalController.getAllClientsAtGym);
router.post("/get/:clientID", arrivalController.getClientsArrivals);
router.post("/get/all/:clientID", arrivalController.getClientsDailyAVGTimeAtGym);
router.post("/", arrivalController.checkIn);
router.put("/", arrivalController.checkOut);

module.exports = router;
