const pool = require("../config/ormconfig");
class UserRepository {
  static async createClient({ f_name, hashedPassword, email }) {
    const now = new Date().toISOString(); // Преобразование даты в строку в формате ISO
    const response = await pool.query(
      "INSERT INTO client (f_name, password, email, created) VALUES ($1, $2, $3, $4) RETURNING *",
      [f_name, hashedPassword, email, now],
    );
    return response.rows[0];
  }
  static async createStaff({
    f_name,
    l_name,
    login,
    email,
    hashedPassword,
    hired,
  }) {
    const hiredDate = hired ? hired : new Date();
    const response = await pool.query(
      "INSERT INTO staff (f_name,l_name,login,email, password, hired) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [f_name, l_name, login, email, hashedPassword, hiredDate],
    );
    return response.rows[0];
  }
  static async getClientData(email) {
    const response = await pool.query("SELECT * FROM client WHERE email = $1", [
      email,
    ]);

    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  }
  static async getStaffData(email) {
    const response = await pool.query("SELECT * FROM staff WHERE email = $1", [
      email,
    ]);
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  }
  static async getStaffDataByLogin(login) {
    const response = await pool.query("SELECT * FROM staff WHERE login = $1", [
      login,
    ]);
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  }
  static async getStaffDataById(staffId) {
    const response = await pool.query("SELECT * FROM staff WHERE id = $1", [
      staffId,
    ]);
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  }
  static async getAllClients() {
    const response = await pool.query("SELECT * FROM client");
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  }
  static async getAllStaff() {
    const response = await pool.query("SELECT * FROM staff");
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
