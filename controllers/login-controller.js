const roleRepository = require("../repositories/role-repository");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = "BILDARA";
const REFRESH_TOKEN_SECRET = "your_refresh_token_secret";
const ACCESS_TOKEN_EXPIRATION = "30"; //CHANGE THIS TO 15min
const REFRESH_TOKEN_EXPIRATION = "7d";

const login = async (req, res) => {
    //POST /login
    const email = req.body.Email;
    const password = req.body.Password;

    const hashedPassword = crypto.createHash("md5").update(password).digest("hex");
    const results = await roleRepository.loginQUERY(email, hashedPassword);

    if (results) {
        const accessToken = jwt.sign(
            {
                Email: results.Email,
                FK_ClientID: results.FK_ClientID,
                FK_EmployeeID: results.FK_EmployeeID,
                isClient: results.isClient,
                isEmployee: results.isEmployee,
                isAdmin: results.isAdmin,
            },
            ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRATION }
        );

        const refreshToken = jwt.sign(
            {
                userId: results.id, // Assuming you have a unique user ID
            },
            REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION }
        );

        // Save the refreshToken in the database or an in-memory store associated with the user

        res.cookie("token", accessToken, {
            httpOnly: true,
            sameSite: "strict", //DOdATI 15 * 60 * 1000 dolje
            expires: new Date(Date.now() + 30 * 1000), // Set the expiration time to match the access token
        });

        res.cookie("refreshToken", refreshToken, {
            // Send the refresh token as a regular cookie (not HttpOnly)
            sameSite: "strict",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set the expiration time for the refresh token
        });

        res.json({ message: "Logged in successfully!", results });
    } else {
        res.status(400).send("Error while trying to login a client!");
    }
};

const logout = async (req, res) => {
    //PROVJERITI ZASTO NE RADI
    // Clear the user's access token cookie and refreshToken
    res.clearCookie("token", { httpOnly: true });
    res.clearCookie("refreshToken", { sameSite: "strict" });

    res.json({ message: "Logout successful" });
};

module.exports = { login, logout };
