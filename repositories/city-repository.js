const sql = require("mssql");
const dbConfig = require("../common/db-config");

const getAllCitiesByCountryID_QUERY = async (countryID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("countryID", sql.Int, countryID)
            .query("SELECT * FROM City WHERE FK_CountryID = @countryID");

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get all cities!");
    }
};

module.exports = { getAllCitiesByCountryID_QUERY };
