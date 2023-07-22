const membershipTypeRepository = require("../repositories/membership-type-repository");

const getAllMembershipTypes = async (req, res, next) => {
    let FK_GymID = req.params.FK_GymID;

    const results = await membershipTypeRepository.getAllMembershipTypesQUERY(FK_GymID);

    if (results) {
        res.status(200).send(results);
    } else {
        res.status(404).send("Error while trying to get all memberships!");
    }
};

module.exports = { getAllMembershipTypes };
