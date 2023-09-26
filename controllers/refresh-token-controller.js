const jwt = require("jsonwebtoken");
// const { REFRESH_TOKEN_SECRET } = require("../common/db-config");

const REFRESH_TOKEN_SECRET = "your_refresh_token_secret";

const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken;
    console.log("REFRESHH TOKENN", refreshToken);
    if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log("NE VALJA NESTO", err);
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("PROSLO, DECODED: ", decoded);
        // If the refresh token is valid, you can add the decoded data to the request object to use it in other middlewares or routes
        req.userData = decoded;

        // Proceed to the next middleware or route
        next();
    });
};

module.exports = { verifyRefreshToken };
