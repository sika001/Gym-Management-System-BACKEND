const sql = require("mssql");
const dbConfig = require("../common/db-config");

const getAllCountriesQUERY = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request.query("SELECT * FROM Country");

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get all countries!");
    }
};

module.exports = { getAllCountriesQUERY };
