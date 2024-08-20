const pool = require("../Config/ormconfig");
class VerificationRepository {
  static async saveVerificationCodeToDB(email, verificationCode) {
    const response = await pool.query(
      "INSERT INTO verification (target, code) VALUES ($1, $2) RETURNING *",
      [email, verificationCode],
    );
    return response.rows[0];
  }

  static async getStoredVerificationCode(email) {
    const response = await pool.query(
      "SELECT * FROM verification WHERE target = $1",
      [email],
    );

    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  }
  static async clearStoredVerificationCode(email) {
    const response = await pool.query(
      "DELETE FROM verification WHERE target = $1",
      [email],
    );
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  }
}

module.exports = VerificationRepository;
