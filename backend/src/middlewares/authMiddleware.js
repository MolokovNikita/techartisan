const ApiError = require("../exceptions/apiError");
const TokenService = require("../services/token");
module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const clientData = TokenService.validateAccessToken(accessToken);
    if (!clientData) {
      return next(ApiError.UnauthorizedError());
    }
    req.client = clientData;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};
