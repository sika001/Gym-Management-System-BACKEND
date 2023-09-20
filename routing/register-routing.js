const express = require("express");
const registerController = require("../controllers/register-controller");
const upload = require("../middlewares/multer-config");

const router = express.Router();

router.post("/", upload.single("Picture"), registerController.register);

module.exports = router;
