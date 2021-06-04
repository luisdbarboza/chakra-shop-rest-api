const express = require("express");
const route = express.Router();

route.use("/users", require("./users"));
route.use("/login", require("./login"));
route.use("/categories", require("./categories"));
route.use("/products", require("./products"));

module.exports = route;
