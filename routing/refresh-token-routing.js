const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/refresh-token-controller");

router.get("/", refreshTokenController.verifyRefreshToken);

module.exports = router;
