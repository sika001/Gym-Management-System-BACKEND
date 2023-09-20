const sql = require("mssql");
const dbConfig = require("../common/db-config");

const getMonthlyRevenueQUERY = async (FK_TransactionTypesID, year) => {
    //used for green curve on graph
    //gets monthly revenue for the current year
    //(counts only membership renewals (FK_TransactionTypesID = 1) and sums them up for each month (GROUP BY MONTH(Date)))
    try {
        const pool = await sql.connect(dbConfig);
        const results = await pool
            .request()
            .input("Year", sql.Int, year ? year : new Date().getFullYear()) //if year is undefined, then it's set to the current year
            .input("FK_TransactionTypesID", sql.Int, FK_TransactionTypesID) //1 - membership renewal, 2 - Salary, 3 - Tax
            .query(`SELECT SUM(Amount) AS Revenue, MONTH(Date) AS Month, YEAR(Date) AS Year
                    FROM Transactions
                    WHERE FK_TransactionTypesID = @FK_TransactionTypesID AND YEAR(Date) = @Year
                    GROUP BY MONTH(Date), YEAR(Date)
                    ORDER BY YEAR(Date), MONTH(Date)`);

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get monthly revenue!", error);
    }
};

const getMonthlyExpensesQUERY = async (FK_TransactionTypesID, year) => {
    //used for red curve on graph
    //gets monthly expenses for the current year
    //(counts salaries and taxes (FK_TransactionTypesID = 2 AND FK_TransactionTypesID = 3) and sums them up for each month (GROUP BY MONTH(Date)))
    try {
        const pool = await sql.connect(dbConfig);
        const results = await pool
            .request()
            .input("Year", sql.Int, year ? year : new Date().getFullYear()) //if year is undefined, then it's set to the current year
            .query(`SELECT  YEAR(Date) AS Year,
                            MONTH(Date) AS Month,
                            SUM(Amount) AS Expenses
                    FROM Transactions
                    WHERE FK_TransactionTypesID = 2 OR FK_TransactionTypesID = 3
                    GROUP BY YEAR(Date), MONTH(Date)
                    ORDER BY Year, Month;`);

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get expenses!", error);
    }
};

const getAllTransactionsQUERY = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const results = await pool.request()
        .query(`SELECT T.*, Types.Type FROM Transactions as T, TransactionTypes as Types 
                WHERE T.FK_TransactionTypesID = Types.ID`);

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get all transactions!", error);
    }
};



const getClientTransactionsQUERY = async (FK_ClientID, startDate, endDate) => {
    //if a dates are not provided, then it's set to thirty days ago from the current date
    //client can only see his own transactions (membership renewals)
    try {
        const currDate = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currDate.getDate() - 30); //sets thirtyDaysAgo to 30 days ago from currDate

        const pool = await sql.connect(dbConfig);
        const results = await pool
            .request()
            .input("FK_ClientID", sql.Int, FK_ClientID)
            .input("FK_TransactionTypesID", sql.Int, 1) //1 is the ID of the transaction type "Membership Renewal"
            .input(
                "startDate",
                sql.DateTime2,
                startDate ? sql.DateTime2(startDate).scale : sql.DateTime2(thirtyDaysAgo).scale
            ) //converts startDate to DateTime2 format (if startDate is undefined, then it's set to thirtyDaysAgo)
            .input(
                "endDate",
                sql.DateTime2,
                endDate ? sql.DateTime2(endDate).scale : sql.DateTime2(currDate).scale
            ) //converts endDate to DateTime2 format
            .query(
                `SELECT T.ID, T.Amount, T.Date, Types.Type, T.FK_ClientID, T.Description
                    FROM Transactions as T, TransactionTypes as Types 
                    WHERE FK_ClientID = @FK_ClientID AND T.FK_TransactionTypesID = @FK_TransactionTypesID
                    AND T.FK_TransactionTypesID = Types.ID AND Date BETWEEN @startDate AND @endDate`
            );

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get all clients' transactions!", error);
    }
};

const getEmployeeTransactionsQUERY = async (FK_EmployeeID, startDate, endDate) => {
    //TESTIRATI OVO
    try {
        const currDate = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currDate.getDate() - 30); //sets thirtyDaysAgo to 30 days ago from currDate

        const pool = await sql.connect(dbConfig);
        const results = await pool
            .request()
            .input("FK_EmployeeID", sql.Int, FK_EmployeeID)
            .input("FK_TransactionTypesID", sql.Int, 1) //1 is the ID of the transaction type "Membership Renewal"
            .input(
                "startDate",
                sql.DateTime2,
                startDate ? sql.DateTime2(startDate).scale : sql.DateTime2(thirtyDaysAgo).scale
            ) //converts startDate to DateTime2 format (if startDate is undefined, then it's set to thirtyDaysAgo)
            .input(
                "endDate",
                sql.DateTime2,
                endDate ? sql.DateTime2(endDate).scale : sql.DateTime2(currDate).scale
            ) //converts endDate to DateTime2 format
            .query(`SELECT T.ID, T.Amount, T.Date, Types.Type, T.FK_EmployeeID, T.Description
                FROM Transactions as T, TransactionTypes as Types 
                WHERE T.FK_EmployeeID = @FK_EmployeeID AND T.FK_TransactionTypesID = @FK_TransactionTypesID  
                AND T.FK_TransactionTypesID = Types.ID AND Date BETWEEN @startDate AND @endDate`);

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get all transactions!", error);
    }
};

const getLatestEmployeesTransactionsQUERY = async () => {
    //vraća posljednju transakciju za svakog zaposlenog (tj. njegovu posljednju platu) da bi se plata mogla isplatiti najviše jednom mjesečno
    try {
        const pool = await sql.connect(dbConfig);
        const results = await pool
            .request()
            .query(`SELECT T1.*
                    FROM Transactions AS T1
                    WHERE T1.[Date] = (
                        SELECT MAX(T2.[Date])
                        FROM Transactions AS T2
                        WHERE T2.FK_EmployeeID = T1.FK_EmployeeID
                    );`);
                    console.log("DAAAAAA", results.recordset);
        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get all transactions!", error);
    }
}

const addNewTransactionQUERY = async (Transaction) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("Amount", sql.Float, Transaction.Amount)
            .input("Date", sql.DateTime2, Transaction.Date)
            .input("FK_TransactionTypesID", sql.Int, Transaction.FK_TransactionTypesID)
            .input("FK_EmployeeID", sql.Int, Transaction.FK_EmployeeID)
            .input("FK_ClientID", sql.Int, Transaction.FK_ClientID)
            .input("Description", sql.NVarChar(200), Transaction.Description)
            .query(
                `INSERT INTO Transactions (Amount, [Date], FK_TransactionTypesID, FK_EmployeeID, FK_ClientID, Description)
                OUTPUT inserted.* 
                VALUES (@Amount, @Date, @FK_TransactionTypesID, @FK_EmployeeID, @FK_ClientID, @Description)`
            );

        return result.recordset[0];
    } catch (error) {
        console.log("Error while trying to make a new transaction!", error);
    }
};

module.exports = {
    getMonthlyRevenueQUERY,
    getAllTransactionsQUERY,
    getLatestEmployeesTransactionsQUERY,
    addNewTransactionQUERY,
    getClientTransactionsQUERY,
    getMonthlyExpensesQUERY,
    getEmployeeTransactionsQUERY,
};
