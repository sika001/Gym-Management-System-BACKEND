const Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var TYPES = require("tedious").TYPES;

// Create connection to database
const dbConfig = {
  server: "localhost",
  authentication: {
    type: "default",
    options: {
      userName: "sa", // update me
      password: "12345678", // update me
    },
  },
  options: {
    trustServerCertificate: true,
    database: "Gym Management System",
  },
};
// const connection = new Connection(dbConfig);

module.exports = dbConfig;
