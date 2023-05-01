const clientRepository = require("../repositories/client-repository");

const getAllClients = async (req, res, next) => {
    try {
        const results = clientRepository.getAllClientsQUERY(); // vraca niz

        if (results) {
            res.status(200);
            const recordset = (await results).recordset; //vraća konkretne vrijednosti za upite
            res.send(recordset);
            // res.json(results);
        } else {
            res.status(404).json({ message: "Record not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

const findClientByName = async (req, res) => {
    try {
        const name = req.body.Name;
        const client = await clientRepository.findClientByNameQUERY(name);

        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).send("Client not found");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const addNewClient = async (req, res) => {
    try {
        const client = req.body;
        const result = await clientRepository.addNewClientQUERY(client);

        if (result) {
            res.status(201);
            res.send(result);
        } else {
            res.status(400).send("Cannot insert a client into a database!");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const updateClient = async (req, res) => {
    try {
        const clientID = req.params.clientID;
        const client = req.body;
        const result = await clientRepository.updateClientQUERY(clientID, client);

        if (result.rowsAffected == 1) {
            res.status(200).send(result);
        } else {
            res.status(400).send("Error while trying to update a client!");
        }
    } catch (error) {
        console.log(error);
    }
};

const deleteClient = async (req, res) => {
    try {
        const clientID = req.params.clientID;
        const result = await clientRepository.deleteClientQUERY(clientID);

        if (result.rowsAffected == 1) {
            res.status(200).send(result);
        } else {
            res.status(400).send("Error while trying to delete a client!");
        }
    } catch (error) {
        console.log("Error while trying to delete a client");
    }
};
module.exports = { getAllClients, findClientByName, addNewClient, updateClient, deleteClient };
