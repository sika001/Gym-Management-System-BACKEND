const sql = require("mssql");
const dbConfig = require("../common/db-config");

const getAllEmployeesQUERY = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const employees = await request
        .query(
            `SELECT E.*, T.Type, G.Name as GymName
            FROM Employee as E, EmployeeType as T , Gym as G
            WHERE E.Deleted = 0 AND E.FK_EmployeeTypeID = T.ID AND E.FK_GymID = G.ID`
        );
        return employees.recordset;

    } catch (error) {
        console.log("Error while trying to get all employees!", error);
    }
};

const getEmployeesWorkoutQUERY = async (ID) => {
    //OVO POGLEDATI PONOVO
    try {
        //by workout
        //by type
        //NAPOMENAA, FK_EmployeeID = 1023  u tabeli Workout je rezervisan za CUSTOM EVENTE, pa se ne prikazuju u listi trenera
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const employees = await request.input("ID", sql.Int, ID).query(
            //vidi treba li da se doda uslov za FK_GymID
            `SELECT
                E.*, T.Type, W.Name as 'Workout Name', W.ID as FK_WorkoutID, W.Type as 'Workout Type', W.GroupSize, W.EmployeePrice
            FROM
                Employee as E
            JOIN
                EmployeeType as T ON E.FK_EmployeeTypeID = T.ID
            RIGHT JOIN
                Workout as W ON E.ID = W.FK_EmployeeID
            WHERE
                T.ID = @ID
            `
        );

        return employees.recordset;
    } catch (error) {
        console.log("Error while trying to get all employees!", error);
    }
};
const getEmployeesScheduleQUERY = async (employeeTypeID) => {
    // SELECT E.*, T.Type, W.Name as 'Workout Name', W.Type as 'Workout Type', W.GroupSize, W.EmployeePrice, 
    //         S.ID as ScheduleID, S.EventName, S.DayOfWeek, S.StartTime, S.EndTime, S.FK_WorkoutID, S.StartDate, S.isRecurring 
    //         FROM Employee as E, EmployeeType as T, Workout as W, Schedule as S
    //         WHERE E.FK_EmployeeTypeID = T.ID AND T.ID = @ID AND E.ID = W.FK_EmployeeID AND S.FK_WorkoutID = W.ID
    //OVO POGLEDATI PONOVO, IMA NEDJE GRESAKA KOD EMPLOYEE
    try {
        //by workout
        //by type
        //NAPOMENAA, FK_EmployeeID = 1023  u tabeli Workout je rezervisan za CUSTOM EVENTE, pa se ne prikazuju u listi trenera
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const employees = await request.input("employeeTypeID", sql.Int, employeeTypeID)
        .query(
            //vidi treba li da se doda uslov za FK_GymID
            `SELECT E.*, T.Type, W.Name as 'Workout Name', W.Type as 'Workout Type', W.GroupSize, W.EmployeePrice, 
            S.ID as ScheduleID, S.EventName, S.DayOfWeek, S.StartTime, S.EndTime, S.FK_WorkoutID, S.StartDate, S.isRecurring 
            FROM Employee as E, EmployeeType as T, Workout as W, Schedule as S
            WHERE E.FK_EmployeeTypeID = T.ID AND T.ID = @employeeTypeID AND E.ID = W.FK_EmployeeID AND S.FK_WorkoutID = W.ID
            `
        );

        return employees.recordset;
    } catch (error) {
        console.log("Error while trying to get all employees!", error);
    }
};

const getEmployeeByID_QUERY = async (employeeID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const employee = await request
            .input("employeeID", sql.Int, employeeID)
            .input("FALSE", 0)
            .query(
                `SELECT E.*, T.Type FROM Employee as E, EmployeeType as T 
                WHERE E.FK_EmployeeTypeID = T.ID AND E.ID = @employeeID AND E.Deleted = @FALSE`
            );

            return employee.recordset[0];
    } catch (error) {
        console.log("Error while trying to get employee by ID!", error);
    }
};


const getEmployeeTypes_QUERY = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const employeeTypes = await request.query(
            `SELECT * FROM EmployeeType`
        );
        
        return employeeTypes.recordset;
    } catch (error) {
        console.log("Error while trying to get employee types!", error);
    }
};

const getEmployeeRoleData_QUERY = async (FK_EmployeeID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const employeeRoleData = await request
            .input("FK_EmployeeID", sql.Int, FK_EmployeeID)
            .query(
                `SELECT Email, FK_EmployeeID FROM Role WHERE FK_EmployeeID = @FK_EmployeeID`
            );

            return employeeRoleData.recordset[0];
    } catch (error) {
        console.log("Error while trying to get employee email!", error);
    }
};

const getDeletedEmployeesQUERY = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const employees = await request.query(
            `SELECT * FROM Employee WHERE Deleted = 1`
        );

        return employees.recordset;
    } catch (error) {
        console.log("Error while trying to get all deleted employees!", error);
    }
};


const addNewEmployeeQUERY = async (Employee) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const result = await request
            .input("Name", sql.NVarChar(50), Employee.Name)
            .input("Surname", sql.NVarChar(50), Employee.Surname)
            .input("DateOfBirth", sql.DateTime2, Employee.DateOfBirth)
            .input("Phone", sql.NVarChar(50), Employee.Phone)
            .input("Address", sql.NVarChar(50), Employee.Address)
            .input("FK_EmployeeTypeID", sql.Int, Employee.FK_EmployeeTypeID)
            .input("FK_GymID", sql.Int, Employee.FK_GymID)
            .input("Picture", sql.NVarChar(50), Employee.PictureName)
            .input("Salary", sql.Float, Employee.Salary)
            .query(
                `INSERT INTO Employee (Name, Surname, DateOfBirth, Phone, Address, FK_EmployeeTypeID, FK_GymID, Picture, Salary) 
                OUTPUT inserted.* VALUES (@Name, @Surname, @DateOfBirth, @Phone, @Address, @FK_EmployeeTypeID, @FK_GymID, @Picture, @Salary)`
            );

        return result; //not returning result.recordset[0] because i need to use rowsAffected in register-controller
    } catch (error) {
        console.log("Error while trying to insert a new employee!", error);
    }
};

const updateEmployeeQUERY = async (employeeID, Employee) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("employeeID", sql.Int, employeeID)
            .input("Name", sql.NVarChar(50), Employee.Name)
            .input("Surname", sql.NVarChar(50), Employee.Surname)
            .input("DateOfBirth", sql.DateTime2, Employee.DateOfBirth)
            .input("Phone", sql.NVarChar(50), Employee.Phone)
            .input("Address", sql.NVarChar(50), Employee.Address)
            .input("FK_EmployeeTypeID", sql.Int, Employee.FK_EmployeeTypeID)
            .input("FK_GymID", sql.Int, Employee.FK_GymID)
            .input("Picture", sql.NVarChar(50), Employee.PictureName)
            .input("Salary", sql.Float, Employee.Salary)
            .query(
                `UPDATE Employee 
                SET Name = ISNULL(@Name, Name), Surname = ISNULL(@Surname, Surname), DateOfBirth = ISNULL(@DateOfBirth, DateOfBirth), 
                Phone = ISNULL(@Phone, Phone), Address = ISNULL(@Address, Address), FK_EmployeeTypeID = ISNULL(@FK_EmployeeTypeID, FK_EmployeeTypeID), 
                FK_GymID = ISNULL(@FK_GymID, FK_GymID), Picture = ISNULL(@Picture, Picture), Salary = ISNULL(@Salary, Salary) 
                WHERE ID = @employeeID;`
            );

        return results;
    } catch (error) {
        console.log("Error while trying to update a employee!", error);
    }
};

const restoreEmployeeQUERY = async (employeeID) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("employeeID", sql.Int, employeeID)
            .input("FALSE", 0)
            .query("UPDATE Employee SET Deleted = @FALSE WHERE ID=@employeeID");

        return results;
    } catch (error) {
        console.log("Error while trying to restore a employee!", error);
    }
};


const deleteEmployeeQUERY = async (employeeID) => {
    //Radi se PUT zahtjev umjesto DELETE-a, a vrijednost polja DELETED se postavlja na 1
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const results = await request
            .input("employeeID", sql.Int, employeeID)
            .input("TRUE", 1)
            .query("UPDATE Employee SET Deleted = @TRUE WHERE ID=@employeeID");

        return results;
    } catch (error) {
        console.log("Error while trying to delete a employee!", error);
    }
};

module.exports = {
    getAllEmployeesQUERY,
    getEmployeesWorkoutQUERY,
    getEmployeesScheduleQUERY,
    getEmployeeByID_QUERY,
    getEmployeeTypes_QUERY,
    getEmployeeRoleData_QUERY,
    getDeletedEmployeesQUERY,
    addNewEmployeeQUERY,
    updateEmployeeQUERY,
    restoreEmployeeQUERY,
    deleteEmployeeQUERY,
};
