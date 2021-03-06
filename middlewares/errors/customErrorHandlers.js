import { CustomError } from "../../helpers/error/CustomError.js";
const customErrorHandlers = (err, req, res, next) => {
  let customError = err;

  // console.log(err.name);
  if (err.name == "SyntaxError") {
    customError = new CustomError("unexpected syntax", 400);
  }
  if ((err.name = "ValidationError")) {
    customError = new CustomError(err.message, 400);
  }
  if (err.name === "CastError") {
    customError = new CustomError("Please provide a valid id", 400);
  }
  if (err.code === 11000) {
    // dublicate error
    customError = new CustomError(
      "Dublicate key found :Please check your input",
      400
    );
  }

  res.status(customError.status || 500).json({
    success: false,
    message: customError.message,
    stack:
      process.env.NODE_ENV === "development" ? customError.stack : undefined,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export { customErrorHandlers, notFound };
