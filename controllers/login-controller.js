const roleRepository = require("../repositories/role-repository");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;

    const hashedPassword = crypto.createHash("md5").update(password).digest("hex"); //hashes password
    console.log(email, password);
    const results = await roleRepository.loginQUERY(email, hashedPassword);
    console.log(results);
    if (results) {
        let token = jwt.sign(
            {
                Email: results.Email,
                FK_ClientID: results.FK_ClientID,
                FK_EmployeeID: results.FK_EmployeeID,
                isClient: results.isClient,
                isEmployee: results.isEmployee,
                isAdmin: results.isAdmin,
            },
            "BILDARA",
            { expiresIn: "10min" }
        );
        // console.log("TOKEN: ", jwt.decode(token));
        res.status(200).send({ results, token });
    } else {
        res.status(400).send("Error while trying to login a client!");
    }
};

module.exports = { login };
