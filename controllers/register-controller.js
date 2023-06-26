const clientRepository = require("../repositories/client-repository");
const employeeRepository = require("../repositories/employee-repository");
const roleRepository = require("../repositories/role-repository");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    //calls 2 functions (addNewClientQUERY and registerClientQuery)
    //first one insert client data into Client table
    //second one inserts client's role in Role table (with email and password)
    const person = req.body;
    const email = person.Email;
    const password = person.Password;
    const hashedPassword = crypto.createHash("md5").update(password).digest("hex"); //hashes password

    const rolePerson = {
        //a person that will be inserted into Role table
        //creates a new object that will be passed to register function (Role table)
        FK_ClientID: null,
        FK_EmployeeID: null,
        Email: email,
        Password: hashedPassword,
        isClient: null,
        isEmployee: null,
        isAdmin: null,
    };

    let result = null;

    ///DONT FORGET TO SET FK_EmployeeTypeID IF YOU WANT TO ADD EMPLOYEE
    if (person.FK_EmployeeTypeID == null) {
        console.log("USLO");
        //if FK_EmployeeTypeID is null, then person is a client
        result = await clientRepository.addNewClientQUERY(person);
        console.log("RESULT: ", result.recordset);

        rolePerson.FK_ClientID = result.recordset[0].ID;
        rolePerson.isClient = 1;
        rolePerson.isEmployee = 0;
        rolePerson.isAdmin = 0;
    } else {
        //otherwise, person is an employee
        result = await employeeRepository.addNewEmployeeQUERY(person);
        console.log("RESULT: ", result);
        rolePerson.FK_EmployeeID = result.recordset[0].ID;
        rolePerson.isEmployee = 1;
        rolePerson.isClient = 0;
        rolePerson.isAdmin = 0;
    }

    if (result.rowsAffected == 1) {
        //if a client/employee is successfully inserted into a database...
        const roleResult = await roleRepository.registerClientQUERY(rolePerson); //email and password must be entered in bod

        if (roleResult.rowsAffected == 1) {
            let token = jwt.sign(
                {
                    Email: email,
                    FK_ClientID: rolePerson.FK_ClientID,
                    FK_EmployeeID: rolePerson.FK_EmployeeID,
                    isClient: rolePerson.isClient,
                    isEmployee: rolePerson.isEmployee,
                    isAdmin: rolePerson.isAdmin,
                },
                "BILDARA",
                { expiresIn: "10min" }
            );
            // console.log("Token: ", jwt.decode(token));
            res.status(201).send({ token, rolePerson, roleResult });
        }
    } else {
        res.status(400).send("Cannot insert a role into a database!");
    }
};

module.exports = { register };
