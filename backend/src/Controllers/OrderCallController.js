const pool = require("../config/ormconfig.js");
const checkAccess = require("../utils/checkAcces");

class ClientController {
  //secured
  async create(req, res) {
    //allow for all users
    try {
      const { name, phone_number } = req.body;
      const sql_insert = `INSERT INTO order_calls (phone_number,client_name) VALUES ($1,$2)`;
      const values = [phone_number, name];
      pool.query(sql_insert, values, (err, result) => {
        if (err) {
          console.error(err.message);
          return res.status(400).send("Bad request - " + err.message);
        }
        res.send("Data inserted successfully!");
      });
    } catch (e) {
      return res.status(400).send("Error: Failed to create record" + e.message);
    }
  }
  async getAll(req, res) {
    //allow only for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.access !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const sql = "SELECT * FROM order_calls";
      pool.query(sql, [], (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        res.json(result.rows);
      });
    } catch (e) {
      return res.status(400).send("Error: Failed to get records" + e.message);
    }
  }

  async getOne(req, res) {
    //allow only for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.access !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const phone_number = req.params.phone_number;
      const sql = "SELECT * FROM order_calls WHERE phone_number = $1";
      pool.query(sql, [phone_number], (err, result) => {
        if (err) {
          console.error(err.message);
          return res.status(400).json({ error: "Invalid syntax" }); // Ошибка базы данных
        }
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "User not found" }); // Пользователь не найден
        }
        res.json(result.rows); // Отправка данных пользователя в формате JSON
      });
    } catch (e) {
      return res.status(400).send("Error: Failed to get record" + e.message);
    }
  }
  async deleteAll(req, res) {
    //allow only for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.access !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const result = await pool.query("SELECT COUNT(*) FROM order_calls");
      const rowCount = result.rows[0].count;
      if (rowCount === "0") {
        return res.status(400).send("Error: Table is empty!");
      }
      await pool.query("DELETE FROM order_calls");
      res.send("All records deleted successfully!");
    } catch (err) {
      return res
        .status(400)
        .send("Error: Failed to delete all records! " + err.message);
    }
  }
  async deleteOne(req, res) {
    //allow only for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.access !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const phone_number = req.params.phone_number;
      const result = await pool.query(
        `SELECT phone_number FROM order_calls WHERE phone_number = $1`,
        [phone_number],
      );
      if (result.rows.length === 0) {
        return res.status(400).send("Error: Client not found!");
      }
      await pool.query(`DELETE FROM order_calls WHERE phone_number = $1`, [
        phone_number,
      ]);
      res.send("Record was deleted successfully!");
    } catch (err) {
      return res
        .status(400)
        .send("Error: Failed to delete the record! " + err.message);
    }
  }
  async update(req, res) {
    res.status(500).send("Update is unavaliable");
  }
}
module.exports = new ClientController();
