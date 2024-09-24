const TokenService = require("../services/token");
const UserRepository = require("../repositories/user");

module.exports = async function checkAccess(authorizationHeader) {
  if (!authorizationHeader) {
    return null;
  }
  const accessToken = authorizationHeader.split(" ")[1];
  if (!accessToken) {
    return null;
  }
  const userData = await TokenService.validateAccessToken(accessToken);
  if (!userData) {
    return null;
  }
  if (userData.access === "client") {
    const client = await UserRepository.getClientData(userData.email);
    if (!client) {
      return new ApiError.BadRequest("Ошибка, пользователь не найден");
    }
    return {
      access: "client",
      client,
    };
  }
  if (userData.access === "staff") {
    const employee = await UserRepository.getStaffData(userData.email);
    if (!employee) {
      return new ApiError.BadRequest("Ошибка, пользователь не найден");
    }
    return {
      access: "staff",
      employee,
    };
  }
};
