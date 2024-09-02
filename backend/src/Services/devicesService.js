const pool = require("../config/ormconfig");

class DevicesController {
  async create(req, res) {
    const { id, name } = req.body;
    const now = new Date().toISOString(); // Преобразование текущей даты в строку в формате ISO
    const sql_insert = `INSERT INTO devices (id, name) VALUES ($1, $2)`;
    const values = [id, name];
    try {
      await pool.query(sql_insert, values);
      res.send("Data inserted successfully!");
    } catch (err) {
      if (err.code === "23505") {
        // Код ошибки 23505 обозначает конфликт уникальности
        return res.status(400).send("Conflict: Data already exists");
      }
      console.error(err.message);
      return res.status(400).send("Bad request - " + err.message);
    }
  }
  async getAll(req, res) {
    const sql = "SELECT * FROM devices";
    pool.query(sql, [], (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      // Преобразование даты и времени в нужный часовой пояс
      res.json(result.rows);
    });
  }

  async getOne(req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM devices WHERE id = $1";
    pool.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(400).json({ error: "Invalid syntax" });
      }
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Device not found" });
      }
      // Преобразование даты и времени в нужный часовой пояс
      res.json(result.rows[0]);
    });
  }

  async deleteAll(req, res) {
    try {
      const result = await pool.query("SELECT COUNT(*) FROM devices");
      const rowCount = result.rows[0].count;
      if (rowCount === "0") {
        return res.status(400).send("Error: Table is empty!");
      }
      await pool.query("DELETE FROM devices");
      res.send("All records deleted successfully!");
    } catch (err) {
      console.error(err.message);
      return res
        .status(400)
        .send("Error: Failed to delete all records! " + err.message);
    }
  }

  async deleteOne(req, res) {
    const id = req.params.id;
    try {
      const result = await pool.query(`SELECT id FROM devices WHERE id = $1`, [
        id,
      ]);
      if (result.rows.length === 0) {
        return res.status(400).send("Error: Device not found!");
      }
      await pool.query(`DELETE FROM devices WHERE id = $1`, [id]);
      res.send("Your record was deleted successfully!");
    } catch (err) {
      console.error(err.message);
      return res
        .status(400)
        .send("Error: Failed to delete the record! " + err.message);
    }
  }

  async update(req, res) {
    const { id, name } = req.body;
    const now = new Date().toISOString(); // Преобразование текущей даты в строку в формате ISO
    const sql_exist = `SELECT id FROM devices WHERE id = $1`;
    pool.query(sql_exist, [id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(400).send("Error: Database error! " + err.message);
      }
      if (result.rows.length === 0) {
        return res.status(400).send("Error: Device not found!");
      }
      // Обновляем запись карты
      const sql_update = `UPDATE devices SET name = $2 WHERE id = $1`;
      pool.query(sql_update, [id, name], (err, result) => {
        if (err) {
          console.error(err.message);
          return res
            .status(400)
            .send("Error: Failed to update device record! " + err.message);
        }
        res.send("Device record updated successfully!");
      });
    });
  }
}
module.exports = new DevicesController();
