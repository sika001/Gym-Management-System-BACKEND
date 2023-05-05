const dbConfig = require("../common/db-config");
const sql = require("mssql");

const getAllWorkoutProgramsQUERY = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request.query("SELECT * FROM WorkoutType");

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get all workout types!", error);
    }
};

const addNewMembershipTypeQUERY = async (Membership) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("Name", sql.NVarChar(50), Membership.Name)
            .input("Type", sql.NVarChar(50), Membership.Type)
            .input("GroupSize", sql.Int, Membership.GroupSize)
            .input("FK_EmployeeID", sql.Int, Membership.FK_EmployeeID)
            .query(
                "INSERT INTO WorkoutType OUTPUT inserted.* VALUES (@Name, @Type, @GroupSize, @FK_EmployeeID)"
            );

        return result.recordset[0];
    } catch (error) {
        console.log("Error while trying to insert a new client!", error);
    }
};

module.exports = { getAllWorkoutProgramsQUERY, addNewMembershipTypeQUERY };
