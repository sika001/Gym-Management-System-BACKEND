const dbConfig = require("../common/db-config");
const sql = require("mssql");

const getAllClientsQUERY = async () => {
    const pool = await sql.connect(dbConfig);
    const results = await pool.request().query("SELECT * FROM Client WHERE Deleted != 1");

    return results;
};

const findClientByNameQUERY = async (name) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("name", sql.NVarChar(255), name)
            .query(`SELECT * FROM Client WHERE Name=@name AND Deleted != 1`);

        return result.recordset[0];
    } catch (error) {
        console.log(error);
    }
};

const addNewClientQUERY = async (Client) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("Name", sql.NVarChar(50), Client.Name)
            .input("Surname", sql.NVarChar(50), Client.Surname)
            .input("DateOfBirth", sql.DateTime2, Client.DateOfBirth)
            .input("Phone", sql.NVarChar(50), Client.Phone)
            .input("Address", sql.NVarChar(50), Client.Address)
            .input("Email", sql.NVarChar(50), Client.Email)
            .input("Password", sql.NVarChar(50), Client.Password)
            .input("FK_WorkoutID", sql.Int, Client.FK_WorkoutID)
            .query(
                "INSERT INTO Client OUTPUT inserted.* VALUES (@Name, @Surname, @DateOfBirth, @Phone, @Address, @Email, @Password, @FK_WorkoutID)"
            );

        return result.recordset[0];
    } catch (e) {
        console.log(e);
    }
};

const updateClientQUERY = async (clientID, Client) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("clientID", sql.Int, clientID)
            .input("Name", sql.NVarChar(50), Client.Name)
            .input("Surname", sql.NVarChar(50), Client.Surname)
            .input("DateOfBirth", sql.DateTime2, Client.DateOfBirth)
            .input("Phone", sql.NVarChar(50), Client.Phone)
            .input("Address", sql.NVarChar(50), Client.Address)
            .input("Email", sql.NVarChar(50), Client.Email)
            .input("Password", sql.NVarChar(50), Client.Password)
            .input("FK_WorkoutID", sql.Int, Client.FK_WorkoutID)
            .query(
                "UPDATE Client SET Name = ISNULL(@Name, Name), Surname = ISNULL(@Surname, Surname), DateOfBirth = ISNULL(@DateOfBirth, DateOfBirth), Phone = ISNULL(@Phone, Phone), Address = ISNULL(@Address, Address), Email = ISNULL(@Email, Email), Password = ISNULL(@Password, Password), FK_WorkoutID = ISNULL(@FK_WorkoutID, FK_WorkoutID) WHERE ID = @clientID;"
            );

        return results;
    } catch (error) {
        console.log("Error while trying to update a client!");
    }
};

const deleteClientQUERY = async (clientID) => {
    //Radi se PUT zahtjev umjesto DELETE-a, a vrijednost polja DELETED se postavlja na 1
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("clientID", sql.Int, clientID)
            .input("TRUE", 1)
            .query("UPDATE Client SET Deleted = @TRUE WHERE ID=@clientID");

        return results;
    } catch (error) {
        console.log("Error while trying to delete a client!");
    }
};

module.exports = {
    getAllClientsQUERY,
    findClientByNameQUERY,
    addNewClientQUERY,
    updateClientQUERY,
    deleteClientQUERY,
};
