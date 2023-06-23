const clientRepository = require("../repositories/client-repository");
const roleRepository = require("../repositories/role-repository");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const registerClient = async (req, res) => {
    //calls 2 functions (addNewClientQUERY and registerClientQuery)
    //first one insert client data into Client table
    //second one inserts client's role in Role table (with email and password)
    const client = req.body;
    const email = client.Email;
    const password = client.Password;

    const hashedPassword = crypto.createHash("md5").update(password).digest("hex"); //hashes password
    const clientResult = await clientRepository.addNewClientQUERY(client);
    const roleClient = {
        //creates a new object that will be passed to register function (Role table)
        FK_ClientID: clientResult.recordset[0].ID,
        Email: email,
        Password: hashedPassword,
        isClient: 1,
    };

    if (clientResult.rowsAffected == 1) {
        const roleResult = await roleRepository.registerClientQUERY(roleClient); //email and password must be entered in bod

        if (roleResult.rowsAffected == 1) {
            let token = jwt.sign(
                {
                    Email: email,
                    FK_ClientID: roleClient.FK_ClientID,
                    FK_EmployeeID: null,
                    isClient: 1,
                    isCoach: null,
                    isAdmin: null,
                },
                "BILDARA",
                { expiresIn: "10min" }
            );
            // console.log("Token: ", jwt.decode(token));
            res.status(201).send({ token, clientResult, roleResult });
        }
    } else {
        res.status(400).send("Cannot insert a client into a database!");
    }
};

module.exports = { registerClient };
