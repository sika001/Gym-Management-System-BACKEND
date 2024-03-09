const sql = require("mssql");
const dbConfig = require("../common/db-config");

const getClientsArrivalsQUERY = async (clientID, startDate, endDate) => {
    //startDate, endDate mora biti datum time DateTime2, tj. moze se predati new Date() pa ce ga konvertovati
    //returns client's arrivals in a given time interval
    try {
        const newDate = new Date(endDate);
        newDate.setDate(newDate.getDate() + 1); //increments endDate by 1 day (need it to include entire [startDate, endDate] interval])
        endDate = newDate;

        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("clientID", sql.Int, clientID)
            .input("startDate", sql.DateTime2, sql.DateTime2(startDate).scale) //converts startDate to DateTime2 format
            .input("endDate", sql.DateTime2, sql.DateTime2(endDate).scale) //converts endDate to DateTime2 format
            .query(`SELECT
                    CAST(ArrivalTime AS DATE) AS Day,
                    SUM(DATEDIFF(MINUTE, ArrivalTime, DepartureTime)) AS TotalTimeInMinutes
                    FROM
                        Arrival
                    WHERE FK_ClientID = @clientID AND ArrivalTime BETWEEN @startDate AND @endDate 
                    GROUP BY
                    CAST(ArrivalTime AS DATE)
                    `);

        return results.recordset;

    } catch (error) {
        console.log("Error while trying to get arrival time!", error);
    }
};

const getClientsDailyAVGTimeAtGymQUERY = async (startDate, endDate) => {
    try {
        const newDate = new Date(endDate);
        newDate.setDate(newDate.getDate() + 1); //increments endDate by 1 day (need it to include entire [startDate, endDate] interval])
        endDate = newDate;

        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("startDate", sql.DateTime2, sql.DateTime2(startDate).scale) //converts startDate to DateTime2 format
            .input("endDate", sql.DateTime2, sql.DateTime2(endDate).scale) //converts endDate to DateTime2 format
                .query(`SELECT
                        CAST(ArrivalTime AS DATE) AS Day,
                        SUM(DATEDIFF(MINUTE, ArrivalTime, DepartureTime)) AS TotalTimeInMinutes
                        FROM
                            Arrival
                        WHERE ArrivalTime BETWEEN @startDate AND @endDate
                        GROUP BY
                        CAST(ArrivalTime AS DATE)`
                    );

        // console.log("AVG TIME AT GYM PER DAY: ", results.recordset);
        return results.recordset;
        
    } catch (error) {
        console.log("Error while trying to get clients daily average time at gym!", error);
    }

}

const getAllClientsAtGymQUERY = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request.input("True", sql.Int, 1)
        .query(`SELECT A.*
                FROM Arrival as A
                WHERE A.AtGym = @True AND A.DepartureTime IS NULL`);

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get clients that are currently at gym!", error);
    }
};

const checkInQUERY = async (clientID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("ArrivalTime", sql.DateTime2, sql.DateTime2(new Date()).scale)
            .input("FK_ClientID", sql.Int, clientID)
            .input("True", sql.Int, 1)
            .query(
                "INSERT INTO Arrival (ArrivalTime, FK_ClientID, AtGym) OUTPUT inserted.* VALUES (@ArrivalTime, @FK_ClientID, @True)"
            );

        return results;
    } catch (error) {
        console.log("Error while trying to check in a client!", error);
    }
};

const checkOutQUERY = async (clientID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("DepartureTime", sql.DateTime2, sql.DateTime2(new Date()).scale)
            .input("FK_ClientID", sql.Int, clientID)
            .query(
                `UPDATE Arrival 
                SET DepartureTime = @DepartureTime, AtGym = 0 
                WHERE FK_ClientID = @FK_ClientID and DepartureTime IS NULL`
            );

        return results;
    } catch (error) {
        console.log("Error while trying to check out a client!");
    }
};

module.exports = { 
                    getClientsArrivalsQUERY, 
                    getAllClientsAtGymQUERY, 
                    getClientsDailyAVGTimeAtGymQUERY,
                    checkInQUERY, 
                    checkOutQUERY 
                };
