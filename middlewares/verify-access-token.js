const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = "BILDARA"; // Replace with your actual secret

// Middleware function to verify an access token
function verifyAccessToken(req, res, next) {
    // console.log("Token decoded: ", jwt.decode(req.cookies.accessToken));
    const accessToken = req.cookies.accessToken;
    // console.log("Access token: ", req.cookies.accessToken);

    // Check if access token exists
    if (!accessToken) {
        console.log("Access token not provided");
        return res.status(401).send({ message: "Access token not provided" });
    }

    try {
        // Verify the access token
        jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error("Error verifying access token:", err);
                return res.status(401).send({ message: "Unauthorized" });
            }

            // console.log("DECODED: ", decoded);

            req.user = decoded; // Store the user information in the request object and pass it to the next middleware

            next();
        });
    } catch (error) {
        console.error("Error verifying access token:", error);
        res.status(401).send({ message: "Invalid access token" });
    }
}

module.exports = verifyAccessToken;
