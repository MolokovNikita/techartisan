const pool = require("../config/ormconfig");
const checkAccess = require("../utils/checkAcces");

class StatusOfOrderController {
  //secured
  async create(req, res) {
    //
    //allow only for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.access !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const { id, orderstatus } = req.body;
      const sql_insert = `INSERT INTO statusoforder (id, orderstatus) VALUES
        ($1, $2)`;
      const values = [id, orderstatus];
      pool.query(sql_insert, values, (err, result) => {
        if (err) {
          if (err.code === "23505") {
            // код ошибки 23505 обозначает конфликт уникальности
            return res.status(400).send("Conflict: Data already exists");
          }
          console.error(err.message);
          return res.status(400).send("Bad request - " + err.message);
        }
        res.send("Data inserted successfully!");
      });
    } catch (e) {
      res.status(400).send("Error: Failed to create record" + e.message);
    }
  }
  async getAll(req, res) {
    //allow for all users
    try {
      const sql = "SELECT * FROM statusoforder";
      pool.query(sql, [], (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        res.json(result.rows);
      });
    } catch (e) {
      res.status(400).send("Error: Failed to get all records" + e.message);
    }
  }
  async getOne(req, res) {
    //allow for all users
    try {
      const id = req.params.id;
      const sql = "SELECT * FROM statusoforder WHERE id = $1";

      pool.query(sql, [id], (err, result) => {
        if (err) {
          console.error(err.message);
          return res.status(400).json({ error: "Invalid syntax" }); // Ошибка базы данных
        }
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "Order-status not found" }); // Пользователь не найден
        }
        res.json(result.rows[0]); // Отправка данных пользователя в формате JSON
      });
    } catch (e) {
      res.status(400).send("Error: Failed to get one record" + e.message);
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
      const result = await pool.query("SELECT COUNT(*) FROM statusoforder");
      const rowCount = result.rows[0].count;
      if (rowCount === "0") {
        return res.status(400).send("Error: Table is empty!");
      }
      await pool.query("DELETE FROM statusoforder");
      res.send("All records deleted successfully!");
    } catch (err) {
      console.error(err.message);
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
      const id = req.params.id;
      const result = await pool.query(
        `SELECT id FROM statusoforder WHERE id = $1`,
        [id],
      );
      if (result.rows.length === 0) {
        return res.status(400).send("Error: Order-status not found!");
      }
      await pool.query(`DELETE FROM statusoforder WHERE id = $1`, [id]);
      res.send("Your record was deleted successfully!");
    } catch (err) {
      return res
        .status(400)
        .send("Error: Failed to delete the record! " + err.message);
    }
  }

  async update(req, res) {
    // allow only for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.access !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const { id, orderstatus } = req.body;
      // Проверяем, есть ли statusoforder с указанным id
      const sql_exist = `SELECT id FROM statusoforder WHERE id = $1`;
      pool.query(sql_exist, [id], (err, result) => {
        if (err) {
          console.error(err.message);
          return res.status(400).send("Error: Database error! " + err.message);
        }
        if (result.rows.length === 0) {
          return res.status(400).send("Error: Order-status not found!");
        }
        // Обновляем запись statusoforder
        const sql_update = `UPDATE statusoforder SET orderstatus = $2 WHERE id = $1`;
        pool.query(sql_update, [id, orderstatus], (err, result) => {
          if (err) {
            return res
              .status(400)
              .send(
                "Error: Failed to update order-status record! " + err.message,
              );
          }
          res.send("Order-status record updated successfully!");
        });
      });
    } catch (e) {
      res.status(400).send("Error: Failed to update one record" + e.message);
    }
  }
}
module.exports = new StatusOfOrderController();
