const cityRepository = require("../repositories/city-repository");

const getAllCitiesByCountryID = async (req, res) => {
    const countryID = req.params.countryID;
    const results = await cityRepository.getAllCitiesByCountryID_QUERY(countryID);

    if (results) {
        res.status(200).send(results);
    } else {
        res.status(400).send("Error while trying to get all cities!");
    }
};

module.exports = { getAllCitiesByCountryID };
