import asyncErrorWraapper from "express-async-handler";
import { CustomError } from "../helpers/error/CustomError.js";
import { User } from "../models/User.js";
import { sentJwtToClient } from "../helpers/authorization/tokenHelpers.js";
import {
  validateUserInput,
  comparePassword,
} from "../helpers/input/inputHelpers.js";
import { sendEmail } from "../helpers/libraries/sendEmail.js";

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

// forgot password

const forgotPassword = asyncErrorWraapper(async (req, res, next) => {
  const resetEmail = req.body.email;
  const user = await User.findOne({ email: resetEmail });

  if (!user) {
    return next(new CustomError("There is no user with that email", 400));
  }

  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  await user.save();

  const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

  const emailTemplate = `
  
  <h3>Reset Your Password</h3>
  <p> This <a href='${resetPasswordUrl}' target = '_blank'>link</a> will expire in a 1 hour</p>

  
  `;

  try {
    await sendEmail({
      from: process.env.SMTP_USER,
      to: resetEmail,
      subject: "reset your password",
      html: emailTemplate,
    });

    return res.status(200).json({
      success: true,
      message: "Token sent to your email",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(new CustomError("Enmail could not be sent", 500));
  }
});

const resetPassword = asyncErrorWraapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;

  const { password } = req.body;

  if (!resetPasswordToken) {
    return next(new CustomError("please provide a valid token", 400));
  }

  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new CustomError("Invalid token or session expired", 404));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "reset password process successful",
  });
});

export { registerUser, login, imageUpload, forgotPassword, resetPassword };
