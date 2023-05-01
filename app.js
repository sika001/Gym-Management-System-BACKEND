const express = require("express");
const clientRouter = module.require("./routing/client-routing.js");
const cors = module.require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //PROVJERITI TREBA LI OVOOO

app.listen(3000, () => {
    console.log("Server started listening  at port 3000");
});

app.use("/client", clientRouter);
