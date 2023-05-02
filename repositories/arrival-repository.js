const sql = require("mssql");
const dbConfig = require("../common/db-config");

const getClientsArrivalsQUERY = async (clientID, startDate, endDate) => {
    //startDate, endDate mora biti datum time DateTime2, tj. moze se predati new Date() pa ce ga konvertovati
    //returns client's arrivals in a given time interval
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("clientID", sql.Int, clientID)
            .input("startDate", sql.DateTime2, sql.DateTime2(startDate).scale) //converts startDate to DateTime2 format
            .input("endDate", sql.DateTime2, sql.DateTime2(endDate).scale) //converts endDate to DateTime2 format
            .query(
                "SELECT C.Name, C.Surname, C.DateOfBirth, C.Phone, C.Address, C.Email, C.FK_WorkoutID, C.Deleted, A.ArrivalTime, A.DepartureTime FROM Arrival as A, Client as C WHERE A.FK_ClientID = C.ID and A.FK_ClientID = @clientID AND A.ArrivalTime BETWEEN @startDate AND @endDate"
            );

        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get arrival time!", error);
    }
};

const checkInQUERY = async (clientID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("ArrivalTime", sql.DateTime2, sql.DateTime2(new Date()).scale)
            .input("FK_ClientID", sql.Int, clientID)
            .query(
                "INSERT INTO Arrival (ArrivalTime, FK_ClientID) OUTPUT inserted.* VALUES (@ArrivalTime, @FK_ClientID)"
            );

        return results;
    } catch (error) {
        console.log("Error while trying to check in a client!", error);
    }
};

const checkOutQUERY = async (clientID, ArrivalTime) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("ArrivalTime", sql.DateTime2, ArrivalTime)
            .input("DepartureTime", sql.DateTime2, sql.DateTime2(new Date()).scale)
            .input("FK_ClientID", sql.Int, clientID)
            .query(
                "UPDATE Arrival SET DepartureTime = @DepartureTime WHERE FK_ClientID = @FK_ClientID and ArrivalTime = @ArrivalTime"
            );

        return results;
    } catch (error) {
        console.log("Error while trying to check out a client!", error);
    }
};
module.exports = { getClientsArrivalsQUERY, checkInQUERY, checkOutQUERY };
