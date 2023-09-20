const transactionRepository = require("../repositories/transaction-repository");

const getMonthlyRevenue = async (req, res) => {
    const transactionID = req.params.FK_TransactionTypesID;
    const year = req.body.year;

    const revenue = await transactionRepository.getMonthlyRevenueQUERY(transactionID, year);

    if (revenue) {
        res.status(200).send(revenue);
    } else {
        res.status(404).send("Error while trying to get monthly revenue!");
    }
};

const getMonthlyExpenses = async (req, res) => {
    const expenses = await transactionRepository.getMonthlyExpensesQUERY();

    if (expenses) {
        res.status(200).send(expenses);
    } else {
        res.status(404).send("Error while trying to get monthly expenses!");
    }
};

const getAllTransactions = async (req, res) => {
    const transactions = await transactionRepository.getAllTransactionsQUERY();

    if (transactions) {
        res.status(200).send(transactions);
    } else {
        res.status(404).send("Error while trying to get all transactions!");
    }
};

const getUsersTransactions = async (req, res) => {
    //OVAJ DIO KODA ZA EMPLOYEE JE SUVIŠAN; ISPRAVITI TO
    const userID = req.params.userID;
    let transactions = null;
    console.log("USLO U GET USERS TRANSACTIONS, StartDate",req.body.startDate, "EndDate", req.body.endDate);
    if (req.route.path.includes("client")) {
        //ako je ruta /client/:userID, onda je klijent
        transactions = await transactionRepository.getClientTransactionsQUERY(
            userID,
            req.body.startDate,
            req.body.endDate
        );
    } else {
        //u suprotnom je zaposleni
        transactions = await transactionRepository.getEmployeeTransactionsQUERY(
            userID,
            req.body.startDate,
            req.body.endDate
        );
    }
    console.log("TRANSAKCIJE: ", transactions);
    if (transactions) {
        res.status(200).send(transactions);
    } else {
        res.status(404).send("Error while trying to get transactions!");
    }
};

const getLatestEmployeesTransactions = async (req, res) => {
    //Vraća zadnju transakciju za svakog zaposlenog (platu)
    const transactions = await transactionRepository.getLatestEmployeesTransactionsQUERY();

    if (transactions) {
        res.status(200).send(transactions);
    } else {
        res.status(404).send("Error while trying to get latest transactions!");
    }
}

const addNewTransaction = async (req, res) => {
    const transaction = req.body;
    const result = await transactionRepository.addNewTransactionQUERY(transaction);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to make a new transaction!");
    }
};

module.exports = { getMonthlyRevenue, 
                   getMonthlyExpenses, 
                   getAllTransactions,
                   getLatestEmployeesTransactions,
                   addNewTransaction, 
                   getUsersTransactions 
                };
