const clientRepository = require("../repositories/client-repository");

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

const updateClient = async (req, res) => {
    const clientID = req.params.clientID;
    const client = req.body;
    console.log("Client: ", client);
    const result = await clientRepository.updateClientQUERY(clientID, client);

    console.log("Result: ", result);
    if (result.rowsAffected[0] === 1) {
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
    updateClient,
    deleteClient,
    getClientByID,
};
