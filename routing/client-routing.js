const express = require("express");
const clientController = require("../controllers/client-controller");

const router = express.Router();

router.get("/", clientController.getAllClients);
router.get("/:clientID", clientController.getClientByID);
router.post("/", clientController.addNewClient);
router.put("/:clientID", clientController.updateClient);
router.put("/delete/:clientID", clientController.deleteClient);

module.exports = router;
