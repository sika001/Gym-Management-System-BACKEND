const employeeRepository = require("../repositories/employee-repository");


const getAllEmployees = async (req, res) => {
    const result = await employeeRepository.getAllEmployeesQUERY();

    console.log("SVI ZAPOSLENI: ", result);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to get all clients!");
    }
};

const getEmployeesWorkout = async (req, res) => {
    //vraća trenere koji rade određeni workout
    const typeID = req.params.typeID;
    const employees = await employeeRepository.getEmployeesWorkoutQUERY(typeID);

    console.log("POKUSAO DA DOBIJE TRENERE ZA WORKOUT: ", employees);
    if (employees) {
        res.status(200).send(employees);
    } else {
        res.status(200).send("Error while trying to get all employees' workouts!");
    }
};

const getEmployeesSchedule = async (req, res) => {
    //vraća trenere koji rade određeni workout, (događaje...)
    const employeeTypeID = req.params.employeeTypeID;
    const results = await employeeRepository.getEmployeesScheduleQUERY(employeeTypeID);
    
    console.log("SCHEDULE I COACH: ", results);
    if (results) {
        res.status(200).send(results);
    } else {
        res.status(200).send("Error while trying to get all schedule data!");
    }  
};

const getEmployeeByID = async (req, res) => {
    const employeeID = req.params.employeeID;
    const employee = await employeeRepository.getEmployeeByID_QUERY(employeeID);

    console.log("GET EMPLOYEE BY ID: ", employee);
    if (employee) {
        res.status(200).send(employee);
    } else {
        res.status(400).send("Error while trying to get employee by ID!");
    }
};


const getEmployeeTypes = async (req, res) => {
    const employeeTypes = await employeeRepository.getEmployeeTypes_QUERY();

    if (employeeTypes) {
        res.status(200).send(employeeTypes);
    } else {
        res.status(400).send("Error while trying to get employee types!");
    }
}

const getEmployeeRoleData = async (req, res) => {
    const FK_EmployeeID = req.params.FK_EmployeeID;
    const employeeRoleData = await employeeRepository.getEmployeeRoleData_QUERY(FK_EmployeeID);

    console.log("employeeRoleData", employeeRoleData);
    if (employeeRoleData) {
        res.status(200).send(employeeRoleData);
    } else {
        res.status(400).send("Error while trying to get employee role data!");
    }

}

const getDeletedEmployees = async (req, res) => {
    const result = await employeeRepository.getDeletedEmployeesQUERY();

    console.log("OBRISANI ZAPOSLENI: ", result);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to get all deleted employees!");
    }
};

const addNewEmployee = async (req, res) => {
    const employee = req.body;

    const result = await employeeRepository.addNewEmployeeQUERY(employee);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to add an employee!");
    }
};

const updateEmployee = async (req, res) => {
    const employeeID = req.params.employeeID;
    const employee = req.body;
    const result = await employeeRepository.updateEmployeeQUERY(employeeID, employee);

    if (result.rowsAffected == 1) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to update an employee!");
    }
};

const restoreEmployee = async (req, res) => {
    const employeeID = req.params.employeeID;
    const result = await employeeRepository.restoreEmployeeQUERY(employeeID);

    if (result.rowsAffected == 1) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to restore an employee!");
    }
};


const deleteEmployee = async (req, res) => {
    const employeeID = req.params.employeeID;
    const result = await employeeRepository.deleteEmployeeQUERY(employeeID);

    if (result.rowsAffected == 1) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to delete a client!");
    }
};


module.exports = {
    getAllEmployees,
    getEmployeesWorkout,
    getEmployeesSchedule,
    getEmployeeByID,
    getEmployeeTypes,
    getEmployeeRoleData,
    getDeletedEmployees,
    addNewEmployee,
    updateEmployee,
    restoreEmployee,
    deleteEmployee,
};
