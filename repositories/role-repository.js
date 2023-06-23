const dbConfig = require("../common/db-config");
const sql = require("mssql");

const registerClientQUERY = async (Client) => {
    //invoked in client-controller (along with addClient function)
    //password is being hashed in client-controller
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        const result = await request
            .input("FK_ClientID", sql.Int, Client.FK_ClientID)
            .input("Email", sql.NVarChar(50), Client.Email)
            .input("Password", sql.NVarChar(50), Client.Password)
            .input("isClient", sql.Int, Client.isClient)
            .query(
                "INSERT INTO Role (FK_ClientID, Email, Password, isClient) OUTPUT inserted.* VALUES (@FK_ClientID, @Email, @Password, @isClient)"
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
                "SELECT * FROM Role as R WHERE Email = @Email AND Password = @Password AND ((isClient = 1 AND NOT EXISTS(SELECT 1 FROM Client as C WHERE C.ID = R.FK_ClientID AND C.Deleted = 1)) OR ((isCoach = 1 OR isAdmin = 1) AND NOT EXISTS(SELECT 1 FROM Employee as E WHERE E.ID = R.FK_EmployeeID AND E.Deleted = 1)));"
            );

        return results.recordset[0];
    } catch (e) {
        console.log("Error while trying to login a client!");
    }
};

module.exports = { registerClientQUERY, loginQUERY };
