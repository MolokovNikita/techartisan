const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TokenService = require("./Token.js");
// import {
//   NotFound,
//   Forbidden,
//   Conflict,
//   Unauthorized,
// } from "../utils/Errors.js";
const RefreshSessionRepository = require("../repositories/RefreshSession.js");
const UserRepository = require("../repositories/User.js");
const ACCESS_TOKEN_EXPIRATION = 18e5;

class AuthService {
  static async signIn({ email, pass, fingerprint }) {
    const userData = await UserRepository.getUserData(email);
    if (!userData) {
      throw new Error("Неверный email или пароль");
    }
    const isPasswordValid = bcrypt.compareSync(pass, userData.pass);
    if (!isPasswordValid) {
      throw new Error("Неверный email или пароль");
    }
    const payload = { id: userData.id, email };
    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionRepository.createRefreshSession({
      id: userData.id,
      refreshToken,
      fingerprint,
    });
    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      id: userData.id,
      f_name: userData.f_name,
      l_name: userData.l_name,
      email: userData.email,
      created: userData.created,
      deleted: userData.deleted,
      phone_number: userData.phone_number,
    };
  }

  static async signUp({ f_name, pass, email, fingerprint }) {
    const userData = await UserRepository.getUserData(email);
    if (userData) {
      throw new Error("Пользователь с таким email уже существует");
    }

    const hashedPassword = bcrypt.hashSync(pass, 8);
    const { id } = await UserRepository.createUser({
      f_name,
      hashedPassword,
      email,
    });
    const payload = { email, id };
    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);
    await RefreshSessionRepository.createRefreshSession({
      id,
      refreshToken,
      fingerprint,
    });
    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      id,
      f_name,
      email,
    };
  }

  static async logOut(refreshToken) {
    await RefreshSessionRepository.deleteRefreshSession(refreshToken);
  }

  static async refresh({ fingerprint, currentRefreshToken }) {
    if (!currentRefreshToken) {
      throw new Error("Unauthorized");
    }
    const refreshSession =
      await RefreshSessionRepository.getRefreshSession(currentRefreshToken);

    if (!refreshSession) {
      throw new Error("Unauthorized");
    }

    if (refreshSession.finger_print !== fingerprint.hash) {
      console.log("Попытка несанкционированного обновления токенов");
      throw new Error("Попытка несанкционированного обновления токенов");
    }

    await RefreshSessionRepository.deleteRefreshSession(currentRefreshToken);
    let payload;
    try {
      payload = await TokenService.verifyRefreshToken(currentRefreshToken);
    } catch (error) {
      throw new Error(error);
    }

    const { id, f_name, l_name, email, created, deleted, phone_number } =
      await UserRepository.getUserData(payload.email);

    const actualPayload = { email, id };

    const accessToken = await TokenService.generateAccessToken(actualPayload);
    const refreshToken = await TokenService.generateRefreshToken(actualPayload);

    await RefreshSessionRepository.createRefreshSession({
      id,
      refreshToken,
      fingerprint,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      id,
      f_name,
      l_name,
      email,
      created,
      deleted,
      phone_number,
    };
  }
}

module.exports = AuthService;
