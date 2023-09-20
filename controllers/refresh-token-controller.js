const jwt = require("jsonwebtoken");
const REFRESH_TOKEN_SECRET = "your_refresh_token_secret";
const ACCESS_TOKEN_SECRET = "BILDARA";
const ACCESS_TOKEN_EXPIRATION = "30s"; //CHANGE THIS TO 15min

//Main purpose of this function is to generate a new access token when the current one expires
const verifyRefreshToken = async (req, res) => {
    // console.log("Verify refresh token activated, REQ COOKIES: ", req.cookies);

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        console.log("Refresh token successfully verified! New access token is being generated!");
        // If the refresh token is valid, you can add the decoded data to the request object to use it in other middlewares or routes
        req.userData = decoded;

        //generate new access token
        const newAccessToken = jwt.sign(
            {
                userID: decoded.userID, // Assuming you have a unique user ID
                // Email: decoded.Email,
                // FK_ClientID: decoded.FK_ClientID,
                // FK_EmployeeID: decoded.FK_EmployeeID,
                // isClient: decoded.isClient,
                // isEmployee: decoded.isEmployee,
                // isAdmin: decoded.isAdmin,
            },
            ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRATION }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "strict", //DOdATI 15 * 60 * 1000 dolje
            expires: new Date(Date.now() + 30 * 1000), // Set the expiration time to match the access token
        });

        return res.status(200).json({ message: "New access token generated" });
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = { verifyRefreshToken };
