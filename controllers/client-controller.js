const clientRepository = require("../repositories/client-repository");
const roleRepository = require("../repositories/role-repository");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const getAllClients = async (req, res, next) => {
    const results = await clientRepository.getAllClientsQUERY();

    if (results) {
        res.status(200).send(results);
    } else {
        res.status(404).send("Error while trying to get all clients!");
    }
};

const getClientByID = async (req, res) => {
    const clientID = req.params.clientID;
    const client = await clientRepository.getClientByID_QUERY(clientID);

    if (client) {
        res.status(200).json(client);
    } else {
        res.status(404).send("Error while trying to get a client!");
    }
};

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

const updateClient = async (req, res) => {
    const clientID = req.params.clientID;
    const client = req.body;
    const result = await clientRepository.updateClientQUERY(clientID, client);

    if (result.rowsAffected == 1) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to update a client!");
    }
};

const deleteClient = async (req, res) => {
    const clientID = req.params.clientID;
    const result = await clientRepository.deleteClientQUERY(clientID);

    if (result.rowsAffected == 1) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to delete a client!");
    }
};
module.exports = {
    getAllClients,
    getClientByID,
    registerClient,
    updateClient,
    deleteClient,
    getClientByID,
};
