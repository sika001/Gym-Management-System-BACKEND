const dbConfig = require("../common/db-config");
const sql = require("mssql");

const addNewEventQUERY = async (Event) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("EventName", sql.NVarChar(50), Event.EventName)
            .input("DayOfWeek", sql.Int, Event.DayOfWeek)
            .input("StartTime", sql.NVarChar(50), Event.StartTime)
            .input("EndTime", sql.NVarChar(50), Event.EndTime)
            .input("FK_WorkoutID", sql.Int, Event.FK_WorkoutID)
            .input("StartDate", sql.DateTime2, Event.StartDate)
            .input("isRecurring", sql.Int, Event.isRecurring)
            .query(
                `INSERT INTO Schedule (EventName, DayOfWeek, StartTime, EndTime, FK_WorkoutID, StartDate, isRecurring) VALUES 
                (@EventName , @DayOfWeek, @StartTime, @EndTime, @FK_WorkoutID, @StartDate, @isRecurring)`
            );

        return result;
    } catch (error) {
        console.log("Error while trying to insert a new event!", error);
    }
};

const updateEventQUERY = async (Event) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("ScheduleID", sql.Int, Event.ScheduleID)
            .input("EventName", sql.NVarChar(50), Event.EventName)
            .input("DayOfWeek", sql.Int, Event.DayOfWeek)
            .input("StartTime", sql.NVarChar(50), Event.StartTime)
            .input("EndTime", sql.NVarChar(50), Event.EndTime)
            .input("FK_WorkoutID", sql.Int, Event.FK_WorkoutID)
            .input("StartDate", sql.DateTime2, Event.StartDate)
            .input("isRecurring", sql.Int, Event.isRecurring)
            .query(
                `UPDATE Schedule SET EventName = ISNULL(@EventName, EventName), DayOfWeek = ISNULL(@DayOfWeek, DayOfWeek),
                 StartTime = ISNULL(@StartTime, StartTime), EndTime = ISNULL(@EndTime, EndTime), FK_WorkoutID = ISNULL(@FK_WorkoutID, FK_WorkoutID), 
                 StartDate = ISNULL(@StartDate, StartDate), isRecurring = ISNULL(@isRecurring, isRecurring) 
                 WHERE ID = @ScheduleID`
            );
        console.log("Results:", results);
        return results;
    } catch (error) {
        console.log("Error while trying to update a client!", error);
    }
};

const deleteEventQUERY = async (ScheduleID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("ScheduleID", sql.Int, ScheduleID)
            .query(`DELETE FROM Schedule WHERE ID = @ScheduleID`);


        return result;
    } catch (error) {
        console.log("Error while trying to delete an event!", error);
    }
};




module.exports = { addNewEventQUERY, updateEventQUERY, deleteEventQUERY };
