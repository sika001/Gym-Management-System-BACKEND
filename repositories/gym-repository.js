const dbConfig = require("../common/db-config");
const sql = require("mssql");

const getLocalGymsQUERY = async (FK_CityID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("FK_CityID", sql.Int, FK_CityID)
            .query(
                "SELECT G.*, C.Name as 'City Name', F.Name as 'Fitness Center'  FROM Gym as G, FitnessCenter as F, City as C WHERE G.FK_CityID = @FK_CityID AND G.FK_CityID = C.ID AND G.FK_FitnessCenterID = F.ID"
            );

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get all local gyms!", error);
    }
};

module.exports = { getLocalGymsQUERY };
