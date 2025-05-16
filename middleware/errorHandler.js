const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  const response = {
    status: "error",
    title: getErrorTitle(statusCode),
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  };

  res.status(statusCode).json(response);
};

const getErrorTitle = (statusCode) => {
  switch (statusCode) {
    case constants.BAD_REQUEST:
      return "Bad Request";
    case constants.NOT_FOUND:
      return "Not Found";
    case constants.UNAUTHORIZED:
      return "Unauthorized";
    case constants.FORBIDDEN:
      return "Forbidden";
    case constants.VALIDATION_ERROR:
      return "Validation Failed";
    case constants.SERVER_ERROR:
      return "Server Error";
    default:
      return "Error";
  }
};

module.exports = errorHandler;
