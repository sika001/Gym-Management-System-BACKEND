const dbConfig = require("../common/db-config");
const sql = require("mssql");

const getAllMembershipsQUERY = async () => {
    try {
        //Data used for Table on frontend
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("TRUE", sql.Int, 1)
            .input("FALSE", sql.Int, 0)
            .query(
                `SELECT C.Name, C.Surname, C.DateOfBirth, C.Phone, W.Name as 'Workout Name', M.StartDate as 'Start', C.Picture,
                M.ExpiryDate as 'Expiry', T.NumDaysValid as 'Valid (days)', T.Name as 'Membership Type', M.Status, M.FK_ClientID, M.ID as 'Membership ID' 
                FROM Membership as M, Client as C, Workout as W, MembershipType as T
                WHERE C.ID = M.FK_ClientID AND C.DELETED = @FALSE AND C.FK_WorkoutID = W.ID AND M.FK_MembershipTypeID = T.ID`
            );
            //append an image from /public/uploads folder to each client
        
        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get all memberships!", error);
    }
};

const getClientsMembershipQUERY = async (clientID) => {
    //Returns all memberships of a given client
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("FALSE", sql.Int, 0)
            .input("clientID", sql.Int, clientID)
            .query(
                `SELECT M.*, T.Name as 'Membership Type', T.Price, T.FK_GymID, T.NumDaysValid, W.Name as 'Workout Name', W.Type as 'Workout Type', W.EmployeePrice as 'Employee Price', W.FK_EmployeeID 
                 FROM Membership as M, MembershipType as T, Client as C, Workout as W
                 WHERE M.FK_ClientID = @clientID AND M.FK_MembershipTypeID = T.ID AND C.ID = M.FK_ClientID AND C.DELETED = @FALSE AND C.FK_WorkoutID = W.ID
                 ORDER BY M.StartDate DESC`
            );

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
        console.log("Membership status set to expired! Results: ", results);
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
    getAllMembershipsQUERY,
    getClientsMembershipQUERY,
    addNewMembershipQUERY,
    updateExpiredMembershipQUERY,
};
