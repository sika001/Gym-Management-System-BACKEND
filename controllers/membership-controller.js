const membershipRepository = require("../repositories/membership-repository");

const getAllMemberships = async (req, res, next) => {
    const results = await membershipRepository.getAllMembershipsQUERY();

    if (results) {
        res.status(200).send(results);
    } else {
        res.status(404).send("Error while trying to get all memberships!");
    }
};

const updateExpiredMemberhsip = async (req, res) => {
    const result = await membershipRepository.updateExpiredMembershipQUERY();

    if (result.rowsAffected == 1) {
        console.log("Updated membership status to expired!");
        res.status(200).send(result);
    } else {
        res.status(204).send("Didn't update anything!"); //204 - No Content
    }
};

const getClientsMembership = async (req, res, next) => {
    const clientID = req.params.clientID;
    const results = await membershipRepository.getClientsMembershipQUERY(clientID);

    if (results) {
        res.status(200).send(results);
    } else {
        res.status(404).send("Error while trying to get client's memberships!");
    }
};
const addNewMembership = async (req, res) => {
    const membership = req.body;
    console.log("Body: ", membership);
    const result = await membershipRepository.addNewMembershipQUERY(membership);

    if (result) {
        res.status(201).send(result);
    } else {
        res.status(400).send("Cannot insert a new membership into a database!");
    }
};

module.exports = {
    getAllMemberships,
    getClientsMembership,
    addNewMembership,
    updateExpiredMemberhsip,
};
