const express = require("express");
const registerController = require("../controllers/register-controller");

const router = express.Router();

router.post("/client", registerController.registerClient);

module.exports = router;
