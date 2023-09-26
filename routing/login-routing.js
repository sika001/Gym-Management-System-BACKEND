const express = require("express");
const loginController = require("../controllers/login-controller");

const router = express.Router();

router.post("/", loginController.login); //not using GET, because of security reasons

module.exports = router;
