const express = require("express");
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const postRoutes = require("./post.route");

const mainRoutes = express.Router();

mainRoutes.use("/user", userRoutes);
mainRoutes.use("/auth", authRoutes);
mainRoutes.use("/post", postRoutes);

module.exports = mainRoutes;
