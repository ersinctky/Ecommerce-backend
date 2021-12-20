import asyncErrorWraapper from "express-async-handler";
import { CustomError } from "../helpers/error/CustomError.js";
import { User } from "../models/User.js";
import { sentJwtToClient } from "../helpers/authorization/tokenHelpers.js";
import {
  validateUserInput,
  comparePassword,
} from "../helpers/input/inputHelpers.js";

const registerUser = asyncErrorWraapper(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new CustomError("user already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  sentJwtToClient(user, res);

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    return next(new CustomError("please check your credentials", 400));
  }
});

const login = asyncErrorWraapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!validateUserInput(email, password)) {
    return next(new CustomError("please check your input", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("there is no user with this email", 400));
  }
  if (!comparePassword(password, user.password)) {
    return next(new CustomError("please check your credentials", 400));
  }
  sentJwtToClient(user, res);
});

const logout = asyncErrorWraapper(async (req, res, next) => {
  localStorage.removeItem();

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

const imageUpload = asyncErrorWraapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profile_image: req.savedProfileImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200),
    json({
      success: true,
      message: "image upload successfull",
      data: user,
    });
});

export { registerUser, login, logout, imageUpload };
