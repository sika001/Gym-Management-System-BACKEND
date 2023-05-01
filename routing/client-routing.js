const express = require("express");
const clientController = require("../controllers/client-controller");

const router = express.Router();

router.get("/", clientController.getAllClients);
router.post("/", clientController.addNewClient);
router.put("/:clientID", clientController.updateClient);
router.put("/delete/:clientID", clientController.deleteClient);
router.get("/find", clientController.findClientByName);

module.exports = router;
