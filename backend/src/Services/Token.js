const jwt =require("jsonwebtoken");
const dotenv  = require("dotenv");
const { Forbidden, Unauthorized }  = require("../utils/Errors.js");

dotenv.config();

class TokenService {
  static async generateAccessToken(payload) {}

  static async generateRefreshToken(payload) {}

  static async checkAccess(req, _, next) {}
}

module.exports =  TokenService;