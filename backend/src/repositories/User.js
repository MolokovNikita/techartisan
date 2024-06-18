const pool = require('../Config/ormconfig');

module.exports = class UserRepository {
  static async createUser({ userName, hashedPassword }) {}

  static async getUserData(userName) {}
}
