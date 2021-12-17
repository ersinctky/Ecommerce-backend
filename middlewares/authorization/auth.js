import { CustomError } from "../../helpers/error/CustomError.js";
import asyncErrorWraapper from "express-async-handler";
import { User } from "../../models/User.js";
import jwt from "jsonwebtoken";
import {
  isTokenIncluded,
  getAccessTokenFromHeader,
} from "../../helpers/authorization/tokenHelpers";

const getAccessToRoute = (req, res, next) => {
  const { JWT_SECRET_KEY } = process.env;
  if (!isTokenIncluded(req)) {
    return next(
      new CustomError("you are not authorized to access this route", 401)
    );
  }
  const accessToken = getAccessTokenFromHeader(req);
  jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(
        new CustomError("you are not authorized to access this route", 401)
      );
    }
    req.user = {
      id: decoded.id,
      name: decoded.name,
    };

    next();
  });
};

export { getAccessToRoute };
