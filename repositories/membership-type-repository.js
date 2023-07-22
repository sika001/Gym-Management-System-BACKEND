const dbConfig = require("../common/db-config");
const sql = require("mssql");

const getAllMembershipTypesQUERY = async (FK_GymID) => {
    try {
        //in a certain gym
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("FK_GymID", sql.Int, FK_GymID)
            .query("SELECT * FROM MembershipType WHERE FK_GymID = @FK_GymID");

        return results;
    } catch (error) {
        console.log("Error while trying to get all memberships!", error);
    }
};

module.exports = { getAllMembershipTypesQUERY };
