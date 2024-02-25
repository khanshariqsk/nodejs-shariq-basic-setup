const UserModel = require("../models/user.model");
const {
  InternalServerError,
  HttpConflictError,
  HttpUnAuthorisedError,
  HttpNotFoundError,
  HttpBadRequestError,
} = require("../services/error.service");

const bcrypt = require("bcryptjs");

const { HttpSuccess } = require("../services/success.service");
const { getUserInfo } = require("../services/auth.service");

exports.updateProfile = async (req, res, next) => {
  try {
    if (req.params.userId !== req.user.id) {
      return next(
        new HttpUnAuthorisedError("You are not allowed to update this profile")
      );
    }

    const { username, password, email, profilePicture } = req.body;

    const existUser = await UserModel.findById(req.user.id);

    if (!existUser) {
      return next(new HttpNotFoundError(`user not found!`));
    }

    if (existUser) {
      if (existUser.username === username) {
        return next(
          new HttpConflictError(`username "${username}" is already taken`)
        );
      } else if (existUser.email === email) {
        return next(new HttpConflictError(`email "${email}" is already taken`));
      }
    }

    const dataToUpdate = {};

    if (username) {
      dataToUpdate.username = username;
    } else if (email) {
      dataToUpdate.email = email;
    } else if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    } else if (profilePicture) {
      dataToUpdate.profilePicture = profilePicture;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return next(new HttpBadRequestError("No data found to update"));
    }

    existUser.set(dataToUpdate);

    const updatedUser = await existUser.save();

    const userInfo = getUserInfo(updatedUser);

    return HttpSuccess(res, userInfo, "Profile updated successfully!");
  } catch (error) {
    return next(new InternalServerError(error.message));
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    if (req.params.userId !== req.user.id) {
      return next(
        new HttpUnAuthorisedError("You are not allowed to delete this user")
      );
    }

    await UserModel.findByIdAndDelete(req.user.id);
    return HttpSuccess(res, null, "User deleted successfully!");
  } catch (error) {
    return next(new InternalServerError(error.message));
  }
};

exports.signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    return HttpSuccess(res, null, "User signed out successfully!");
  } catch (error) {
    return next(new InternalServerError(error.message));
  }
};
