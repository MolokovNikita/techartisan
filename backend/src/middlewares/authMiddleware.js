const ApiError = require("../exceptions/apiError");
const TokenService = require("../services/token.js");
module.exports = async function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const clientData = await TokenService.validateAccessToken(accessToken);
    if (!clientData) {
      return next(ApiError.UnauthorizedError());
    }
    req.client = clientData;
    req.isEmployee = false;
    next();
  } catch (e) {
    console.log(e);
    return next(ApiError.UnauthorizedError());
  }
};
