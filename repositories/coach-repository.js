const sql = require("mssql");
const dbConfig = require("../common/db-config");

const getAllCoachesQUERY = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const coaches = await request.query(
            "SELECT * FROM Employee as E, Coach as C WHERE E.ID = C.FK_ID AND E.Deleted = 0"
        );
        return coaches.recordset;
    } catch (error) {
        console.log("Error while trying to get all coaches!");
    }
};

const getCoachByID_QUERY = async (coachID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const coach = await request
            .input("coachID", sql.Int, coachID)
            .input("FALSE", 0)
            .query(
                "SELECT * FRsOM Employee as E, Coach as C WHERE E.ID = C.FK_ID AND c.FK_ID = @coachID AND E.Deleted = @FALSE"
            );

        return coach.recordset[0];
    } catch (error) {
        console.log("Error while trying to get coach by ID!");
    }
};

const addNewCoachQUERY = async (Coach) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("Name", sql.NVarChar(50), Coach.Name)
            .input("Surname", sql.NVarChar(50), Coach.Surname)
            .input("DateOfBirth", sql.DateTime2, Coach.DateOfBirth)
            .input("Phone", sql.NVarChar(50), Coach.Phone)
            .input("Address", sql.NVarChar(50), Coach.Address)
            .input("Email", sql.NVarChar(50), Coach.Email)
            .input("Password", sql.NVarChar(50), Coach.Password)
            .input("FK_GymID", sql.Int, Coach.FK_GymID)
            .query(
                "INSERT INTO Employee (Name, Surname, DateOfBirth, Phone, Address, Email, Password, FK_GymID) OUTPUT inserted.* VALUES (@Name, @Surname, @DateOfBirth, @Phone, @Address, @Email, @Password, @FK_GymID)"
            );
        console.log(result);
        return result.recordset[0];
    } catch (e) {
        console.log("Error while trying to insert a new coach!");
    }
};

const updateCoachQUERY = async (coachID, Coach) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("coachID", sql.Int, coachID)
            .input("Name", sql.NVarChar(50), Coach.Name)
            .input("Surname", sql.NVarChar(50), Coach.Surname)
            .input("DateOfBirth", sql.DateTime2, Coach.DateOfBirth)
            .input("Phone", sql.NVarChar(50), Coach.Phone)
            .input("Address", sql.NVarChar(50), Coach.Address)
            .input("Email", sql.NVarChar(50), Coach.Email)
            .input("Password", sql.NVarChar(50), Coach.Password)
            .input("FK_GymID", sql.Int, Coach.FK_GymID)
            .query(
                "UPDATE Employee SET Name = ISNULL(@Name, Name), Surname = ISNULL(@Surname, Surname), DateOfBirth = ISNULL(@DateOfBirth, DateOfBirth), Phone = ISNULL(@Phone, Phone), Address = ISNULL(@Address, Address), Email = ISNULL(@Email, Email), Password = ISNULL(@Password, Password), FK_GymID = ISNULL(@FK_GymID, FK_GymID) WHERE ID = @coachID;"
            );

        return results;
    } catch (error) {
        console.log("Error while trying to update a coach!");
    }
};

const deleteCoachQUERY = async (coachID) => {
    //Radi se PUT zahtjev umjesto DELETE-a, a vrijednost polja DELETED se postavlja na 1
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("coachID", sql.Int, coachID)
            .input("TRUE", 1)
            .query("UPDATE Employee SET Deleted = @TRUE WHERE ID=@coachID");

        return results;
    } catch (error) {
        console.log("Error while trying to delete a coach!");
    }
};

module.exports = {
    getAllCoachesQUERY,
    getCoachByID_QUERY,
    addNewCoachQUERY,
    updateCoachQUERY,
    deleteCoachQUERY,
};
