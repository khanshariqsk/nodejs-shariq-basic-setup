const express = require("express");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  updateProfile,
  deleteProfile,
  signout,
} = require("../controllers/user.controller");
const { handleValidation } = require("../middlewares/validation.middleware");
const { profileUpdateValidation } = require("../validations/user.validation");

const userRoutes = express.Router();

userRoutes.put(
  "/update/:userId",
  verifyToken,
  handleValidation(profileUpdateValidation),
  updateProfile
);

userRoutes.delete("/delete/:userId", verifyToken, deleteProfile);

userRoutes.post("/signout", verifyToken, signout);

module.exports = userRoutes;
