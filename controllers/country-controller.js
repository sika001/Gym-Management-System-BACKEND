const countryRepository = require("../repositories/country-repository");

const getAllCountries = async (req, res) => {
    const results = await countryRepository.getAllCountriesQUERY();

    if (results) {
        res.status(200).send(results);
    } else {
        res.status(404).send("Error while trying to get all countries!");
    }
};

module.exports = { getAllCountries };
