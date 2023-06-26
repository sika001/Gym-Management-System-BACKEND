const express = require("express");
const employeeRepository = require("../controllers/employee-controller");

const router = express.Router();

router.get("/", employeeRepository.getAllEmployeees);
router.get("/:employeeID", employeeRepository.getEmployeeByID);
router.put("/:employeeID", employeeRepository.updateEmployee);
router.put("/delete/:employeeID", employeeRepository.deleteEmployee);
router.post("/", employeeRepository.addNewEmployee);

module.exports = router;
