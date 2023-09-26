const express = require("express");
const gymController = require("../controllers/gym-controller");

const router = express.Router();

router.get("/:FK_CityID", gymController.getLocalGyms);

module.exports = router;
