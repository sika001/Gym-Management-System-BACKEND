const express = require("express");
const transactionController = require("../controllers/transaction-controller");
const verifyAccessToken = require("../middlewares/verify-access-token");

const router = express.Router();

router.get("/expenses", verifyAccessToken, transactionController.getMonthlyExpenses);
router.get("/revenue/:FK_TransactionTypesID",verifyAccessToken,transactionController.getMonthlyRevenue);
router.get("/all", verifyAccessToken, transactionController.getAllTransactions);
router.get("/client/:userID", verifyAccessToken, transactionController.getUsersTransactions); //realizujemo kao post zahtjev jer saljemo body parametre
router.get("/employee/:userID", verifyAccessToken, transactionController.getUsersTransactions);
router.get("/latest", verifyAccessToken, transactionController.getLatestEmployeesTransactions);
router.post("/", transactionController.addNewTransaction); // /register koristi ovu fju pa ne treba verifyAccessToken

module.exports = router;
