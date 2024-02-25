const express = require("express");
const mainRoutes = require("./routes/main.route");
const { globalErrorHandler, noRouteFound } = require("./utils/error.util");
const cookieParser = require("cookie-parser");

const app = express();

//middlewares
app.use(cookieParser());
app.use(express.json());

//main routes
app.use("/api", mainRoutes);

//global error handler
app.use(globalErrorHandler);

//no route found
app.use(noRouteFound);

module.exports = app;
