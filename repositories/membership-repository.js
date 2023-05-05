const dbConfig = require("../common/db-config");
const sql = require("mssql");

const getAllActiveMembershipsQUERY = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("TRUE", sql.Int, 1)
            .query("SELECT * FROM Membership WHERE Status = @TRUE");

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get all memberships!", error);
    }
};

const getClientsInactiveMembershipsQUERY = async (clientID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("FALSE", sql.Int, 0)
            .input("clientID", sql.Int, clientID)
            .query("SELECT * FROM Membership WHERE Status = @FALSE AND FK_ClientID = @clientID");

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get client's inactive memberships!", error);
    }
};

const updateExpiredMembershipQUERY = async () => {
    //Ovo pokrenuti na pocetku programa na frontu
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        const results = await request.query(
            "UPDATE Membership SET Status = 0 WHERE ExpiryDate <= GETDATE() AND STATUS <> 0"
        );
        console.log(results);
        return results;
    } catch (error) {
        console.log("Error while trying to set membership status to expired!", error);
    }
};
const addNewMembershipQUERY = async (Membership) => {
    //Adds new membership, and sets => ExpiryDate = StartDate + NumDaysValid
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("Status", sql.Int, Membership.Status)
            .input("FK_MembershipTypeID", sql.Int, Membership.FK_MembershipTypeID)
            .input("StartDate", sql.DateTime2, Membership.StartDate)
            .input("FK_ClientID", sql.Int, Membership.FK_ClientID)
            .query(
                "INSERT INTO Membership (Status, StartDate, ExpiryDate, FK_ClientID, FK_MembershipTypeID) OUTPUT inserted.* " +
                    "SELECT @Status, @StartDate, DATEADD(day, NumDaysValid, @StartDate), @FK_ClientID, @FK_MembershipTypeID " +
                    "FROM MembershipType " +
                    "WHERE ID = @FK_MembershipTypeID"
            );

        return result.recordset[0];
    } catch (error) {
        console.log("Error while trying to insert a new Membership!", error);
    }
};

module.exports = {
    getAllActiveMembershipsQUERY,
    getClientsInactiveMembershipsQUERY,
    addNewMembershipQUERY,
    updateExpiredMembershipQUERY,
};
