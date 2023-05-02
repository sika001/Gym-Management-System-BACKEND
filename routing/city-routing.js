const express = require("express");
const router = express.Router();
const cityController = require("../controllers/city-controller");

router.get("/:countryID", cityController.getAllCitiesByCountryID);

module.exports = router;
