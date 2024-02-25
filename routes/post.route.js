const express = require("express");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

const { handleValidation } = require("../middlewares/validation.middleware");
const {
  createPost,
  getPosts,
  deletePost,
  updatePost,
} = require("../controllers/post.controller");
const {
  createPostValidation,
  updatePostValidation,
} = require("../validations/post.validation");

const postRoutes = express.Router();

postRoutes.post(
  "/create",
  verifyToken,
  isAdmin,
  handleValidation(createPostValidation),
  createPost
);

postRoutes.get("/getposts", verifyToken, getPosts);

postRoutes.delete(
  "/deletepost/:postId/:userId",
  verifyToken,
  isAdmin,
  deletePost
);

postRoutes.put(
  "/updatepost/:postId/:userId",
  verifyToken,
  isAdmin,
  handleValidation(updatePostValidation),
  updatePost
);

module.exports = postRoutes;
