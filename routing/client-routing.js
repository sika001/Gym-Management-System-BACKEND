const express = require("express");
const clientController = require("../controllers/client-controller");
const upload = require("../middlewares/multer-config");

const router = express.Router();

router.get("/", clientController.getAllClients);
router.get("/:clientID", clientController.getClientByID);
router.put("/:clientID", upload.single("Picture"), clientController.updateClient);
router.put("/delete/:clientID", clientController.deleteClient);

module.exports = router;
