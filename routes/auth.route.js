const express = require("express");
const { signup, signin, googleSignup } = require("../controllers/auth.controller");
const { handleValidation } = require("../middlewares/validation.middleware");
const {
  signupValidation,
  signinValidation,
  signupOAuthValidation,
} = require("../validations/auth.validation");

const authRoutes = express.Router();

authRoutes.post("/signup", handleValidation(signupValidation), signup);

authRoutes.post("/signin", handleValidation(signinValidation), signin);

authRoutes.post(
  "/google",
  handleValidation(signupOAuthValidation),
  googleSignup
);

module.exports = authRoutes;
