const ECommerceError = require("./baseError");
const { StatusCodes } = require("http-status-codes");
class UnAuthorizedError extends ECommerceError {
  constructor(specificMessage) {
    super(
      StatusCodes.UNAUTHORIZED,
      specificMessage,
      "UNAUTHORIZED",
      "UNAUTHORIZED Request"
    );
  }
}
module.exports = UnAuthorizedError;