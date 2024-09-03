const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Forbidden = require("../utils/errors.js");
const Unauthorized = require("../utils/errors.js");
const tokenRepository = require("../repositories/tokenRepository.js");
dotenv.config();

class TokenService {
  // generateTokens(payload){
  //   const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
  //     expiresIn: "30m",
  //   });
  //   const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
  //     expiresIn: "30d",
  //   });
  //   return{
  //     accessToken,
  //     refreshToken
  //   }
  // }
  // async saveToken(userId, refreshToken, fingerprint){
  //   const tokenData = await tokenRepository.getRefreshSession(userId);
  //   if(tokenData){
  //     tokenData.refreshToken = refreshToken;
  //     return tokenData.save();
  //   }
  //   const token = await tokenRepository.createRefreshSession(userId, refreshToken,fingerprint);
  //   return token;
  // }
    // async removeToken(refreshToken){
    //   const tokenData = await tokenRepository.deleteRefreshSession(refreshToken);
    //   return tokenData;
    // }
    // async findToken(refreshToken){
    //   const tokenData = tokenRepository.getRefreshSession(refreshToken);
    //   return tokenData;
    // }
    
    async validateRefreshToken(refreshToken) {
      try{
        const ClientData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        return ClientData;
        }
        catch(e){
          return null;
        }
    }
    async validateAccessToken(accessToken) {
    try{
      const ClientData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      return ClientData;
      }
      catch(e){
        return null;
      }
    }
  static async generateAccessToken(payload) {
    const JWTToken = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });
    return JWTToken;
  }

  static async generateRefreshToken(payload) {
    return await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "15d",
    });
  }

  static async verifyAccessToken(accessToken) {
    return await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  }

  static async verifyRefreshToken(refreshToken) {
    return await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  }

  static async checkAccess(req, _, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")?.[1];

    if (!token) {
      return next(new Unauthorized());
    }

    try {
      req.user = await TokenService.verifyAccessToken(token);
    } catch (error) {
      return next(new Error(error));
    }

    next();
  }
}

module.exports = TokenService;
