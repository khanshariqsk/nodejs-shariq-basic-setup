const UserModel = require("../models/user.model");
const {
  InternalServerError,
  HttpConflictError,
  HttpBadRequestError,
} = require("../services/error.service");

const bcrypt = require("bcryptjs");

const {
  HttpSuccessCreated,
  HttpSuccess,
} = require("../services/success.service");
const { DEFAULT_PROFILE_IMAGE } = require("../config");
const { generateToken, getUserInfo } = require("../services/auth.service");

exports.signup = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existUser) {
      if (existUser.username === username) {
        return next(
          new HttpConflictError(`username "${username}" is already taken`)
        );
      } else {
        return next(new HttpConflictError(`email "${email}" is already taken`));
      }
    }

    await UserModel.create({
      username,
      password: hashedPassword,
      email,
    });

    return HttpSuccessCreated(res, null, "Signup successfully!");
  } catch (error) {
    return next(new InternalServerError(error.message));
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    const existUser = await UserModel.findOne({ email });

    if (!existUser) {
      return next(new HttpBadRequestError("email or password is incorrect!"));
    }

    const isPasswordValid = await bcrypt.compare(password, existUser.password);

    if (!isPasswordValid) {
      return next(new HttpBadRequestError("email or password is incorrect!"));
    }

    const userInfo = getUserInfo(existUser);

    const token = generateToken(userInfo);

    res.cookie("access_token", token, {
      httpOnly: true,
    });

    return HttpSuccess(res, userInfo, "Signin successfully!");
  } catch (error) {
    return next(new InternalServerError(error.message));
  }
};

exports.googleSignup = async (req, res, next) => {
  try {
    const { username, email, googlePhotoUrl } = req.body;

    let existUser = await UserModel.findOne({ email });

    if (!existUser) {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = await bcrypt.hash(generatePassword, 12);

      existUser = await UserModel.create({
        email,
        username:
          username.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        password: hashedPassword,
        profilePicture: googlePhotoUrl || DEFAULT_PROFILE_IMAGE,
      });
    }

    const userInfo = getUserInfo(existUser);

    const token = generateToken(userInfo);

    res.cookie("access_token", token, {
      httpOnly: true,
    });

    return HttpSuccess(res, userInfo, "Signin successfully!");
  } catch (error) {
    return next(new InternalServerError(error.message));
  }
};
