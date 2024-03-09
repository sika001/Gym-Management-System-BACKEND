const dbConfig = require("../common/db-config");
const sql = require("mssql");

const getAllClientsQUERY = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const results = await pool
            .request()
            .input("FALSE", sql.Int, 0)
            .query("SELECT * FROM Client WHERE Deleted = @FALSE");

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get all clients!", error);
    }
};

const getClientByID_QUERY = async (clientID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("clientID", sql.Int, clientID)
            .input("FALSE", sql.Int, 0)
            .query("SELECT * FROM Client WHERE ID=@clientID AND Deleted = @FALSE");

        return result.recordset[0];
    } catch (error) {
        console.log("Error while trying to get client by ID!", error);
    }
};

const addNewClientQUERY = async (Client) => {
    try {
        console.log("PIC: ", Client.Picture);
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("Name", sql.NVarChar(50), Client.Name)
            .input("Surname", sql.NVarChar(50), Client.Surname)
            .input("DateOfBirth", sql.DateTime2, Client.DateOfBirth)
            .input("Phone", sql.NVarChar(50), Client.Phone)
            .input("Address", sql.NVarChar(50), Client.Address)
            .input("FK_WorkoutID", sql.Int, Client.FK_WorkoutID)
            .input("Picture", sql.NVarChar(50), Client.PictureName) //Picture is a file, so we need to get its name
            .query(
                `INSERT INTO Client (Name, Surname, DateOfBirth, Phone, Address, FK_WorkoutID, Picture) OUTPUT inserted.* 
                VALUES (@Name, @Surname, @DateOfBirth, @Phone, @Address, @FK_WorkoutID, @Picture)`
            );

            console.log("REGISTROVANI KLIJENT: ", result);
        return result;
    } catch (error) {
        console.log("Error while trying to insert a new client!", error);
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
            .input("FK_WorkoutID", sql.Int, Client.FK_WorkoutID)
            .input("Picture", sql.NVarChar(50), Client.PictureName)
            .query(
                `UPDATE Client SET Name = ISNULL(@Name, Name), Surname = ISNULL(@Surname, Surname), 
                DateOfBirth = ISNULL(@DateOfBirth, DateOfBirth), Phone = ISNULL(@Phone, Phone), 
                Address = ISNULL(@Address, Address), FK_WorkoutID = ISNULL(@FK_WorkoutID, FK_WorkoutID),
                Picture = ISNULL(@Picture, Picture)
                WHERE ID = @clientID;`
            );

        return results;
    } catch (error) {
        console.log("Error while trying to update a client!", error);
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
        console.log("Error while trying to delete a client!", error);
    }
};

module.exports = {
    getAllClientsQUERY,
    getClientByID_QUERY,
    addNewClientQUERY,
    updateClientQUERY,
    deleteClientQUERY,
};
