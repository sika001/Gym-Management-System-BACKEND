const dbConfig = require("../common/db-config");
const sql = require("mssql");

const getAllWorkoutProgramsQUERY = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request.query("SELECT * FROM Workout");

        console.log("RESULTS", results);
        return results.recordset;
    } catch (error) {
        console.log("Error while trying to get all workout programs!", error);
    }
};

const addWorkoutProgramQUERY = async (Workout) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("Name", sql.NVarChar(50), Workout.Name)
            .input("Type", sql.NVarChar(50), Workout.Type)
            .input("GroupSize", sql.Int, Workout.GroupSize)
            .input("FK_EmployeeID", sql.Int, Workout.FK_EmployeeID)
            .input("EmployeePrice", sql.Int, Workout.EmployeePrice)
            .query(
                "INSERT INTO Workout OUTPUT inserted.* VALUES (@Name, @Type, @GroupSize, @FK_EmployeeID, @EmployeePrice)"
            );

        return result.recordset[0];
    } catch (error) {
        console.log("Error while trying to insert a new workout program!", error);
    }
};

const deleteWorkoutProgramQUERY = async (workoutID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("workoutID", sql.Int, workoutID)
            .query(`DELETE FROM Workout WHERE ID = @workoutID`);
                
        return result;
    } catch (error) {
        console.log("Error while trying to delete a workout program!", error);
    }
};


module.exports = { getAllWorkoutProgramsQUERY, addWorkoutProgramQUERY, deleteWorkoutProgramQUERY };
