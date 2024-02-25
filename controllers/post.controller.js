const PostModel = require("../models/post.model");
const {
  InternalServerError,
  HttpConflictError,
  HttpNotFoundError,
  HttpUnAuthorisedError,
} = require("../services/error.service");
const { generatePostTitleSlug } = require("../services/post.service");

const {
  HttpSuccess,
  HttpSuccessCreated,
} = require("../services/success.service");

exports.createPost = async (req, res, next) => {
  try {
    const { content, title, image, category } = req.body;
    const slug = generatePostTitleSlug(title);

    const existPost = await PostModel.findOne({
      $or: [
        {
          slug,
        },
        {
          title,
        },
      ],
    });

    if (existPost && existPost.title === title) {
      return next(new HttpConflictError(`title ${title} already exists!`));
    }

    const createdPost = await PostModel.create({
      content,
      title,
      image,
      category,
      slug,
      userId: req.user.id,
    });

    return HttpSuccessCreated(res, createdPost, "Post created successfully!");
  } catch (error) {
    return next(new InternalServerError(error.message));
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await PostModel.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { category: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await PostModel.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await PostModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return HttpSuccess(res, { posts, totalPosts, lastMonthPosts });
  } catch (error) {
    return next(new InternalServerError(error.message));
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return next(
        new HttpUnAuthorisedError("You are not allowed to delete this post!")
      );
    }

    const post = await PostModel.findOne({
      userId: req.params.userId,
      _id: req.params.postId,
    });

    if (!post) {
      return next(new HttpNotFoundError("Post not found!"));
    }

    await PostModel.findOneAndDelete({
      userId: req.params.userId,
      _id: req.params.postId,
    });

    return HttpSuccess(res, null, "Post deleted successfully");
  } catch (error) {
    return next(new InternalServerError(error.message));
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return next(
        new HttpUnAuthorisedError("You are not allowed to delete this post!")
      );
    }

    const post = await PostModel.findOne({
      userId: req.params.userId,
      _id: req.params.postId,
    });

    if (!post) {
      return next(new HttpNotFoundError("Post not found!"));
    }

    const updatedPost = await PostModel.findOneAndUpdate(
      {
        userId: req.params.userId,
        _id: req.params.postId,
      },
      {
        content: req.body.content,
        title: req.body.title,
        image: req.body.image,
        category: req.body.category,
      },
      { new: true }
    );

    return HttpSuccess(res, updatedPost, "Post updated successfully");
  } catch (error) {
    return next(new InternalServerError(error.message));
  }
};
