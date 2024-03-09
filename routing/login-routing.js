const express = require("express");
const loginController = require("../controllers/login-controller");
const verifyAccessToken = require("../middlewares/verify-access-token");

const router = express.Router();

router.post("/", loginController.login); //not using GET, because of security reasons
router.put("/", verifyAccessToken, loginController.updateLoginInfo);


module.exports = router;
