const express = require("express");
const employeeController = require("../controllers/employee-controller");
const verifyAccessToken = require("../middlewares/verify-access-token");
const upload = require("../middlewares/multer-config");

const router = express.Router();

router.get("/", employeeController.getAllEmployees);
router.get("/type", employeeController.getEmployeeTypes);
router.get("/type/:typeID", employeeController.getEmployeesWorkout);
router.get("/schedule/:employeeTypeID", employeeController.getEmployeesSchedule) //koristi za schedule komponentu
router.get("/:employeeID", employeeController.getEmployeeByID); //koristi se i za login, pa ne treba verifyAccessToken 
router.get("/role/:FK_EmployeeID", employeeController.getEmployeeRoleData);
router.get("/get/deleted", verifyAccessToken, employeeController.getDeletedEmployees); //potrebno za prikaz obrisanih zaposlenih
router.put("/:employeeID", verifyAccessToken, upload.single("Picture"), employeeController.updateEmployee); //mora za sliku da se doda upload.single("Picture") middleware
router.put("/delete/:employeeID", verifyAccessToken, employeeController.deleteEmployee);
router.put("/restore/:employeeID", verifyAccessToken, employeeController.restoreEmployee); //postavlja na 0 polje Deleted
router.post("/", verifyAccessToken, upload.single("Picture"), employeeController.addNewEmployee);

module.exports = router;
