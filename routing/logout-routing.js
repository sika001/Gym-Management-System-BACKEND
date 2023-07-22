const express = require("express");
const loginController = require("../controllers/login-controller");

//separate router added, beacuse of protected routes in app.js
const router = express.Router();

router.get("/", loginController.logout);

module.exports = router;
