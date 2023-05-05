const express = require("express");
const cors = module.require("cors");
const clientRouter = module.require("./routing/client-routing.js");
const coachRouter = module.require("./routing/coach-routing.js");
const arrivalRouter = module.require("./routing/arrival-routing.js");
const countryRouter = module.require("./routing/country-routing.js");
const cityRouter = module.require("./routing/city-routing.js");
const membershipRouter = module.require("./routing/membership-routing.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //PROVJERITI TREBA LI OVOOO

app.listen(3000, () => {
    console.log("Server started listening  at port 3000");
});

app.use("/client", clientRouter);
app.use("/coach", coachRouter);
app.use("/arrival", arrivalRouter);
app.use("/country", countryRouter);
app.use("/city", cityRouter);
app.use("/membership", membershipRouter);
