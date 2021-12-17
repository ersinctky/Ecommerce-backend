import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";

const registerUser = asyncHandler(async (req, res, next) => {
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

export { registerUser };
