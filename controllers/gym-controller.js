const gymRepository = require("../repositories/gym-repository");

const getLocalGyms = async (req, res) => {
    const FK_CityID = req.params.FK_CityID;

    const gyms = await gymRepository.getLocalGymsQUERY(FK_CityID);
    if (gyms) {
        res.status(200).json(gyms);
    } else {
        res.status(404).send("Error while trying to get local gyms!");
    }
};

module.exports = { getLocalGyms };
