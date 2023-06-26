const sql = require("mssql");
const dbConfig = require("../common/db-config");

const getAllEmployeesQUERY = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);
        const employees = await request.query(
            "SELECT * FROM Employee as E, EmployeeType as T WHERE E.FK_EmployeeTypeID = T.ID AND E.Deleted = 0"
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
                "SELECT * FROM Employee as E, EmployeeType as T WHERE E.FK_EmployeeTypeID = T.ID AND E.ID = @employeeID AND E.Deleted = @FALSE"
            );

        return employee.recordset[0];
    } catch (error) {
        console.log("Error while trying to get employee by ID!", error);
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
            .query(
                "INSERT INTO Employee (Name, Surname, DateOfBirth, Phone, Address, FK_EmployeeTypeID, FK_GymID) OUTPUT inserted.* VALUES (@Name, @Surname, @DateOfBirth, @Phone, @Address, @FK_EmployeeTypeID, @FK_GymID)"
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
            .query(
                "UPDATE Employee SET Name = ISNULL(@Name, Name), Surname = ISNULL(@Surname, Surname), DateOfBirth = ISNULL(@DateOfBirth, DateOfBirth), Phone = ISNULL(@Phone, Phone), Address = ISNULL(@Address, Address), FK_EmployeeTypeID = ISNULL(@FK_EmployeeTypeID, FK_EmployeeTypeID), FK_GymID = ISNULL(@FK_GymID, FK_GymID) WHERE ID = @employeeID;"
            );

        return results;
    } catch (error) {
        console.log("Error while trying to update a employee!", error);
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
    getEmployeeByID_QUERY,
    addNewEmployeeQUERY,
    updateEmployeeQUERY,
    deleteEmployeeQUERY,
};
