const roleRepository = require("../repositories/role-repository");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = "BILDARA";
const REFRESH_TOKEN_SECRET = "your_refresh_token_secret";
const ACCESS_TOKEN_EXPIRATION = "30s"; //CHANGE THIS TO 15min
const REFRESH_TOKEN_EXPIRATION = "7d";

const login = async (req, res) => {
    //POST /login
    const email = req.body.Email;
    const password = req.body.Password;

    const hashedPassword = crypto.createHash("md5").update(password).digest("hex"); //hashes password
    const results = await roleRepository.loginQUERY(email, hashedPassword);
    console.log("RESULTS LOGIN: ", results);
    if (results) {
        console.log("RESULTS: ", results, "Results.id", results.ID);
        const accessToken = jwt.sign(
            {
                userID: results.IDs, // Assuming you have a unique user ID
                // Email: results.Email,
                // FK_ClientID: results.FK_ClientID,
                // FK_EmployeeID: results.FK_EmployeeID,
                // isClient: results.isClient,
                // isEmployee: results.isEmployee,
                // isAdmin: results.isAdmin,
            },
            ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRATION }
        );
        console.log("DECODED: ", jwt.decode(accessToken));
        const refreshToken = jwt.sign(
            {
                userID: results.IDs, // Assuming you have a unique user ID
                // Email: results.Email,
                // FK_ClientID: results.FK_ClientID,
                // FK_EmployeeID: results.FK_EmployeeID,
                // isClient: results.isClient,
                // isEmployee: results.isEmployee,
                // isAdmin: results.isAdmin,
            },
            REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION }
        );

        // Save the refreshToken in the database or an in-memory store associated with the user

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict", //DOdATI 15 * 60 * 1000 dolje
            expires: new Date(Date.now() + 30 * 1000), // Set the expiration time to match the access token
        });

        res.cookie("refreshToken", refreshToken, {
            // Send the refresh token as a regular cookie (not HttpOnly)
            sameSite: "strict",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set the expiration time for the refresh token
        });

        // console.log("Access Token: ", accessToken, "Refresh Token:", jwt.decode(refreshToken));
        res.json({ message: "Logged in successfully!", results });
    } else {
        res.status(401).send("Error while trying to login a client!");
    }
};

const logout = async (req, res) => {
    // Clear the user's access token cookie and refreshToken
    res.clearCookie("accessToken", { httpOnly: true });
    res.clearCookie("refreshToken", { sameSite: "strict" });

    res.json({ message: "Logout successful" });
};

const updateLoginInfo = async (req, res) => {
    //hashes edited password
    const password = req.body.Password;
    const hashedPassword = password ? crypto.createHash("md5").update(password).digest("hex") : null;

    const roleData = {
        Email: req.body.Email,
        Password: hashedPassword,
        FK_ClientID: req.body.FK_ClientID,
        FK_EmployeeID: req.body.FK_EmployeeID,
    };

    console.log("Role data: ", roleData);
    const result = await roleRepository.updateLoginInfoQUERY(roleData);

    if (result.rowsAffected[0] === 1) {
        res.status(200).send(result);
    } else {
        res.status(400).send("Error while trying to update login information!");
    }
};

module.exports = { login, logout, updateLoginInfo };
