const ECommerceError = require("./baseError.js");
const { StatusCodes } = require("http-status-codes");
class badRequest extends ECommerceError {
  constructor(specificMessage) {
    super(
      StatusCodes.BAD_REQUEST,
      specificMessage,
      "Bad Request",
      "Invalid Request"
    );
  }
}

module.exports = badRequest;