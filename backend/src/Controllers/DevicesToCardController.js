const pool = require("../Config/ormconfig");

class DevicesToCardController {
  async create(req, res) {
    const { cardoforder_id, devices_id } = req.body;
    const now = new Date().toISOString(); // Преобразование даты в строку в формате ISO
    const sql_insert = `INSERT INTO devicestocard (cardoforder_id, devices_id) VALUES
        ($1, $2)`;
    const values = [cardoforder_id, devices_id];
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
  }
  async getAll(req, res) {
    const sql = "SELECT * FROM devicestocard";
    pool.query(sql, [], (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      res.json(result.rows);
    });
  }
  async getOne(req, res) {
    const cardoforder_id = req.params.id;
    const sql = "SELECT * FROM devicestocard WHERE cardoforder_id = $1";
    pool.query(sql, [cardoforder_id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(400).json({ error: "Invalid syntax" }); // Ошибка базы данных
      }
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Relation not found" }); // Пользователь не найден
      }
      res.json(result.rows); // Отправка данных пользователя в формате JSON
    });
  }
  async deleteAll(req, res) {
    const sql_count = "SELECT COUNT(*) FROM devicestocard"; // Подсчитать количество записей в таблице client
    pool.query(sql_count, (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      const rowCount = result.rows[0].count; // Получить количество записей из результата запроса
      if (rowCount === "0") {
        return res.status(400).send("Error: Table is empty!");
      }
      const sql_delete = "DELETE FROM devicestocard"; // Удалить все записи из таблицы client
      pool.query(sql_delete, (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        res.send("All records deleted successfully!");
      });
    });
  }
  async deleteOne(req, res) {
    const cardoforder_id = req.params.id;
    const sql_exist = `SELECT cardoforder_id FROM devicestocard WHERE cardoforder_id = $1`;
    pool.query(sql_exist, [cardoforder_id], (err, result) => {
      if (err) {
        return res.status(400).send("Error " + err.message);
      }
      if (result.rows.length === 0) {
        return res.status(400).send("Error: Office not found!");
      }
      const sql_delete = `DELETE FROM devicestocard WHERE cardoforder_id = $1`;
      pool.query(sql_delete, [card_id], (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        res.send("Your record was deleted successfully!");
      });
    });
  }
  async deleteOneDevice(req, res) {
    const { cardoforder_id, devices_id } = req.body;
    const sql_exist = `SELECT * FROM devicestocard WHERE cardoforder_id = $1 AND devices_id = $2`;
    pool.query(sql_exist, [cardoforder_id, devices_id], (err, result) => {
      if (err) {
        return res.status(400).send("Error " + err.message);
      }
      if (result.rows.length === 0) {
        return res.status(404).send("Error: Relation not found!");
      }
      const sql_delete = `DELETE FROM devicestocard WHERE cardoforder_id = $1 AND devices_id = $2`;
      pool.query(sql_delete, [cardoforder_id, devices_id], (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        res.send("Relation deleted successfully!");
      });
    });
  }

  async update(req, res) {
    const { cardoforder_id, devices_id, new_devices_id } = req.body;
    // Проверяем, существует ли запись с указанным cardoforder_id и devices_id
    const sql_exist = `SELECT * FROM devicestocard WHERE cardoforder_id = $1 AND devices_id = $2`;
    pool.query(sql_exist, [cardoforder_id, devices_id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(400).send("Error: Database error! " + err.message);
      }
      if (result.rows.length === 0) {
        return res.status(400).send("Error: Relation not found!");
      }
      // Обновляем запись
      const sql_update = `UPDATE devicestocard SET devices_id = $3 WHERE cardoforder_id = $1 AND devices_id = $2`;
      pool.query(
        sql_update,
        [cardoforder_id, devices_id, new_devices_id],
        (err, result) => {
          if (err) {
            console.error(err.message);
            return res
              .status(400)
              .send("Error: Failed to update record! " + err.message);
          }
          res.send("Record updated successfully!");
        },
      );
    });
  }
}
module.exports = new DevicesToCardController();
