import { User } from "../../models/User.js";

import { CustomError } from "../../helpers/error/CustomError.js";
import asyncErrorWraapper from "express-async-handler";

const checkUserExist = asyncErrorWraapper(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return next(new CustomError("There is no such user with that id", 400));
  }
  next();
});

export { checkUserExist };
