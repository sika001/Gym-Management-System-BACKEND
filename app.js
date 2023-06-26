const express = require("express");
const { authentication } = require("./common/db-config");
const cors = module.require("cors");
const clientRouter = module.require("./routing/client-routing.js");
const employeeRouter = module.require("./routing/employee-routing.js");
const arrivalRouter = module.require("./routing/arrival-routing.js");
const countryRouter = module.require("./routing/country-routing.js");
const cityRouter = module.require("./routing/city-routing.js");
const membershipRouter = module.require("./routing/membership-routing.js");
const workoutRouter = module.require("./routing/workout-routing.js");
const loginRouter = module.require("./routing/login-routing.js");
const registerRouter = module.require("./routing/register-routing.js");
const auth = module.require("./middlewares/authentication.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //PROVJERITI TREBA LI OVOOO

app.listen(3000, () => {
    console.log("Server started listening  at port 3000");
});

//VRATITI AUTORIZACIJu
app.use("/client", clientRouter); //Zasticene rute
app.use("/employee", employeeRouter);
app.use("/arrival", arrivalRouter);
app.use("/country", countryRouter);
app.use("/city", cityRouter);
app.use("/membership", membershipRouter);
app.use("/workout", workoutRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
