const employeeRepository = require("../repositories/employee-repository");

const getAllEmployeees = async (req, res) => {
    const typeID = req.params.typeID;
    const employees = await employeeRepository.getEmployeesWorkoutQUERY(typeID);

    if (employees) {
        res.status(200).send(employees);
    } else {
        res.status(200).send("Error while trying to get all clients!");
    }
};

const getEmployeeByID = async (req, res) => {
    const employeeID = req.params.employeeID;
    const employee = await employeeRepository.getEmployeeByID_QUERY(employeeID);

    if (employee) {
        res.status(200).send(employee);
    } else {
        res.status(400).send("Error while trying to get employee7 by ID!");
    }
};

const addNewEmployee = async (req, res) => {
    const employee = req.body;
    const result = await employeeRepository.addNewEmployeeQUERY(employee);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to add a new employee!");
    }
};

const updateEmployee = async (req, res) => {
    const employeeID = req.params.employeeID;
    const employee = req.body;
    const result = await employeeRepository.updateEmployeeQUERY(employeeID, employee);

    if (result.rowsAffected == 1) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to update a client!");
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
    getAllEmployeees,
    getEmployeeByID,
    addNewEmployee,
    updateEmployee,
    deleteEmployee,
};
