const pool = require("../Config/ormconfig");
class UserRepository {
  static async createUser({ f_name, hashedPassword, email }) {
    const now = new Date().toISOString(); // Преобразование даты в строку в формате ISO
    const response = await pool.query(
      "INSERT INTO client (f_name, pass, email, created) VALUES ($1, $2, $3, $4) RETURNING *",
      [f_name, hashedPassword, email, now],
    );
    return response.rows[0];
  }

  static async getUserData(email) {
    const response = await pool.query("SELECT * FROM client WHERE email = $1", [
      email,
    ]);

    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  }
  static async getUserDataByPhoneNumber(phone_number) {
    const response = await pool.query(
      "SELECT * FROM client WHERE phone_number = $1",
      [phone_number],
    );

    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  }
}

module.exports = UserRepository;
