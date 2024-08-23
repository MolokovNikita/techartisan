const pool = require("../Config/ormconfig");
class VerificationRepository {
  static async saveVerificationCodeToDB(emailOrPhone, verificationCode) {
    const response = await pool.query(
      "INSERT INTO verification (target, code) VALUES ($1, $2) RETURNING *",
      [emailOrPhone, verificationCode],
    );
    return response.rows[0];
  }

  static async getStoredVerificationCode(emailOrPhone) {
    const response = await pool.query(
      "SELECT * FROM verification WHERE target = $1",
      [emailOrPhone],
    );

    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  }
  static async clearStoredVerificationCode(emailOrPhone) {
    const response = await pool.query(
      "DELETE FROM verification WHERE target = $1",
      [emailOrPhone],
    );
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  }
}

module.exports = VerificationRepository;
