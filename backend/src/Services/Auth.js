const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TokenService = require("./Token.js");
// import {
//   NotFound,
//   Forbidden,
//   Conflict,
//   Unauthorized,
// } from "../utils/Errors.js";
const RefreshSessionRepository =require ("../repositories/RefreshSession.js");
const UserRepository = require("../repositories/User.js");
const ACCESS_TOKEN_EXPIRATION = 18e5;

class AuthService {
  static async signIn({ email, pass, fingerprint }) {
    console.log(pass, email);
    const userData = await UserRepository.getUserData(email);
    if (!userData) {
      throw new Error("Пользователь не найден");
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
    console.log(userData.id, refreshToken, fingerprint)
    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      id: userData.id,
      f_name: userData.f_name
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
    };
  }

  static async logOut(refreshToken) {
    await RefreshSessionRepository.deleteRefreshSession(refreshToken);
  }

  static async refresh({ fingerprint, currentRefreshToken }) {
    if (!currentRefreshToken) {
      throw new Error('Unauthorized');
    }

    const refreshSession = await RefreshSessionRepository.getRefreshSession(
      currentRefreshToken
    );

    if (!refreshSession) {
      throw new Error('Unauthorized');
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
      throw new Forbidden(error);
    }

    const {
      id,
      role,
      name: userName,
    } = await UserRepository.getUserData(payload.userName);

    const actualPayload = { id, userName, role };

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
    };
  }
}

module.exports = AuthService;