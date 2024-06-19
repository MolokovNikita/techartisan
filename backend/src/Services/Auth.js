const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const TokenService = require('./Token.js')
const {NotFound,
  Forbidden,
  Unauthorized} = require('../utils/Errors.js')
const Conflict = require('../utils/Errors.js')
const UserRepository = require('../repositories/User.js')
const ACCESS_TOKEN_EXPIRATION = 18e5;
class AuthService {
  static async signIn({ email, password, fingerprint }) {
    const userData = await UserRepository.getUserData(email);
    if (!userData) {
      throw new NotFound("Пользователь не найден");
    }

    const isPasswordValid = bcrypt.compareSync(password, userData.password);

    if (!isPasswordValid) {
      throw new Forbidden("Неверный email или пароль");
    }

    const payload = {id: userData.id, email };

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
    };
  }

  static async signUp({ f_name, pass, email, fingerprint }) {
    console.log('inAuthService - ', f_name, email, pass, fingerprint )
    const userData = await UserRepository.getUserData(email);
    console.log(userData);
    if (userData) {
      throw new Error("Пользователь с таким email уже существует");
    }

    const hashedPassword = bcrypt.hashSync(pass, 8);
    const { id } = await UserRepository.createUser({
      f_name,
      hashedPassword,
      email,
    });

    console.log('userCreated');
    const payload = { f_name, email, id };

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async logOut(refreshToken) {
    await RefreshSessionRepository.deleteRefreshSession(refreshToken);
  }

  static async refresh({ fingerprint, currentRefreshToken }) {
    if (!currentRefreshToken) {
      throw new Unauthorized();
    }

    const refreshSession = await RefreshSessionRepository.getRefreshSession(
      currentRefreshToken
    );

    if (!refreshSession) {
      throw new Unauthorized();
    }

    if (refreshSession.finger_print !== fingerprint.hash) {
      console.log("Попытка несанкционированного обновления токенов");
      throw new Forbidden();
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