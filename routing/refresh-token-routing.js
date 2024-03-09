const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/refresh-token-controller");

router.get("/", refreshTokenController.verifyRefreshToken); //when an access token expires, a new one is generated

module.exports = router;
