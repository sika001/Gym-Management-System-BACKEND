const { expressjwt } = require("express-jwt");

const auth = expressjwt({ secret: "BILDARA", algorithms: ["HS256"] });

module.exports = auth;
