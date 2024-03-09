const express = require("express");
const cors = module.require("cors");
const clientRouter = module.require("./routing/client-routing.js");
const employeeRouter = module.require("./routing/employee-routing.js");
const arrivalRouter = module.require("./routing/arrival-routing.js");
const countryRouter = module.require("./routing/country-routing.js");
const cityRouter = module.require("./routing/city-routing.js");
const membershipRouter = module.require("./routing/membership-routing.js");
const membershipTypeRouter = module.require("./routing/membership-type-routing.js");
const workoutRouter = module.require("./routing/workout-routing.js");
const loginRouter = module.require("./routing/login-routing.js");
const logoutRouter = module.require("./routing/logout-routing.js");
const registerRouter = module.require("./routing/register-routing.js");
const gymRouter = module.require("./routing/gym-routing.js");
const scheduleRouter = module.require("./routing/schedule-routing.js");
const transactionRouter = module.require("./routing/transaction-routing.js");
const refreshTokenRouter = module.require("./routing/refresh-token-routing.js");
const cookieParser = require("cookie-parser");
const path = require("path");

const verifyAccessToken = module.require("./middlewares/verify-access-token.js");

const app = express();

// CORS middleware - omogućava komunikaciju između fronta i backa
app.use(
    cors({
        origin: "http://localhost:3001",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(3000, () => {
    console.log("Server started listening  at port 3000");
});

app.use(express.static(path.join(__dirname, "public"))); //omogućava pristup public folderu i na frontu

app.use("/client", verifyAccessToken, clientRouter);
app.use("/arrival", verifyAccessToken, arrivalRouter);
app.use("/schedule", verifyAccessToken, scheduleRouter);
// NAPOMENA: verifyAccessToken middleware se ne koristi za login i register jer se u njima kreira access token
// neke od ovih ruta ispod, imaju verifyAccessToken middleware u routing.js fajlovima
app.use("/logout",  logoutRouter);
app.use("/employee", employeeRouter);
app.use("/transaction", transactionRouter);
app.use("/country", countryRouter);
app.use("/gym", gymRouter);
app.use("/city", cityRouter);
app.use("/membership", membershipRouter);
app.use("/membership-type", membershipTypeRouter);
app.use("/workout", workoutRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/refresh-token", refreshTokenRouter);
