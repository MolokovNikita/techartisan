const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TokenService = require('./Token.js')
const { NotFound, Forbidden, Conflict } =require ("../utils/Errors.js");
const RefreshSessionsRepository = require("../repositories/RefreshSession.js");
const UserRepository = require('../repositories/User.js')
const { ACCESS_TOKEN_EXPIRATION } = require ('../constants.js');

class AuthService {
  static async signIn({ userName, password, fingerprint }) {}

  static async signUp({ userName, password, fingerprint, role }) {}

  static async logOut(refreshToken) {}

  static async refresh({ fingerprint, currentRefreshToken }) {}
}
module.exports = AuthService;
