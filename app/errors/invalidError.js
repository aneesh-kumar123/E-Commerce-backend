const { StatusCodes } = require("http-status-codes");
const ECommerceError = require("./baseError");

class InvalidError extends ECommerceError {
  constructor(specificMessage) {
    super(
      StatusCodes.BAD_REQUEST,
      specificMessage,
      "Invalid Error",
      "Invalid request"
    );
  }
}

module.exports = InvalidError;