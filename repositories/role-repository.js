const dbConfig = require("../common/db-config");
const sql = require("mssql");
const clientRepository = require("./client-repository");
const employeeRepository = require("./employee-repository");

const registerClientQUERY = async (Client) => {
    //poziva se u client-controlleru (zajedno sa  addClient funkcijom)
    //password se hešira u client-controlleru
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
        //password se hešira u login-controlleru
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        //loguje korisnika pomoću maila i passworda, ako nije obrisan
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
                    OR ((isEmployee = 1 OR isAdmin = 1) 
                    AND NOT EXISTS(SELECT 1 FROM Employee as E WHERE E.ID = R.FK_EmployeeID AND E.Deleted = 1))
                );`
            );

        if (results.recordset.length === 1) {
            //ako korisnik postoji, vraća njegove podatke
            const roleData = results.recordset[0];
            console.log("roleData", roleData);
            let userData;
            if (roleData.isClient) {
                const clientResult = await clientRepository.getClientByID_QUERY(
                    roleData.FK_ClientID
                ); 
                userData = { ...roleData, ...clientResult }; //vraća client i role podatke
            } else {
                //TEST THIS PART WITH AN EMPLYOEE
                const employeeResult = await employeeRepository.getEmployeeByID_QUERY(
                    roleData.FK_EmployeeID
                ); //not calling the function from employee-controller, beacuse it accepts FK_EmployeeID as an url parameter
               
                userData = { ...roleData, ...employeeResult }; //returns employees and role data
            }

            console.log("userData", userData);
            return userData;
        }
    } catch (e) {
        console.log("Error while trying to login a user!");
    }
};

const updateLoginInfoQUERY = async (User) => {
    //updates email and password in Role table
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        const results = await request
            .input("Email", sql.NVarChar(50), User.Email)
            .input("Password", sql.NVarChar(50), User.Password)
            .input("FK_ClientID", sql.Int, User.FK_ClientID)
            .input("FK_EmployeeID", sql.Int, User.FK_EmployeeID)
            .query(
                `UPDATE Role 
                SET Email = ISNULL(@Email, Email), Password = ISNULL(@Password, Password)
                WHERE FK_ClientID = @FK_ClientID OR FK_EmployeeID = @FK_EmployeeID`
            );

        return results;
    } catch (e) {
        console.log("Error while trying to update login info!");
    }
};

module.exports = { registerClientQUERY, loginQUERY, updateLoginInfoQUERY };
