const dbConfig = require("../common/db-config");
const sql = require("mssql");
const clientRepository = require("./client-repository");
const employeeRepository = require("./employee-repository");

const registerClientQUERY = async (Client) => {
    //invoked in client-controller (along with addClient function)
    //password is being hashed in client-controller
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        const result = await request
            .input("FK_ClientID", sql.Int, Client.FK_ClientID)
            .input("FK_EmployeeID", sql.Int, Client.FK_EmployeeID)
            .input("Email", sql.NVarChar(50), Client.Email)
            .input("Password", sql.NVarChar(50), Client.Password)
            .input("isClient", sql.Int, Client.isClient)
            .input("isEmployee", sql.Int, Client.isEmployee)
            .input("isAdmin", sql.Int, Client.isAdmin)
            .query(
                "INSERT INTO Role (FK_ClientID, FK_EmployeeID, Email, Password, isClient, isEmployee, isAdmin) OUTPUT inserted.* VALUES (@FK_ClientID, @FK_EmployeeID, @Email, @Password, @isClient, @isEmployee, @isAdmin)"
            );

        return result;
    } catch (e) {
        console.log("Error while trying to register a client!");
    }
};

const loginQUERY = async (Email, Password) => {
    try {
        //password is being hashed in the login-controller
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        const results = await request
            .input("Email", sql.NVarChar(50), Email)
            .input("Password", sql.NVarChar(50), Password)
            .query(
                `SELECT *
                FROM Role as R
                WHERE
                Email = @Email
                AND Password = @Password
                AND (
                    (isClient = 1 AND NOT EXISTS(SELECT 1 FROM Client as C WHERE C.ID = R.FK_ClientID AND C.Deleted = 1))
                    OR ((isEmployee = 1 OR isAdmin = 1) AND NOT EXISTS(SELECT 1 FROM Employee as E WHERE E.ID = R.FK_EmployeeID AND E.Deleted = 1))
                );`
            );

        if (results.recordset.length === 1) {
            //if a user exists, get his data
            const roleData = results.recordset[0];

            let userData;
            if (roleData.isClient) {
                const clientResult = await clientRepository.getClientByID_QUERY(
                    roleData.FK_ClientID
                ); //not calling the function from client-controller, beacuse it accepts FK_ClientID as an url parameter
                userData = clientResult;
            } else {
                //TEST THIS PART WITH AN EMPLYOEE
                const employeeResult = await employeeRepository.getEmployeeByID_QUERY(
                    roleData.FK_EmployeeID
                ); //not calling the function from employee-controller, beacuse it accepts FK_EmployeeID as an url parameter

                userData = employeeResult.recordset[0];
            }
            console.log("userData", userData);
            return userData;
        }
    } catch (e) {
        console.log("Error while trying to login a user!");
    }
};

module.exports = { registerClientQUERY, loginQUERY };
