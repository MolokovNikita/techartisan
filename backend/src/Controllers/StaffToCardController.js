const pool = require("../config/ormconfig");
const checkAccess = require("../utils/checkAcces");
const CardRepository = require("../repositories/cardRepository");

class StaffToCardController {
  async create(req, res) {
    //allow only for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.acces !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const { cardoforder_id, staff_id } = req.body;
      const sql_insert = `INSERT INTO stafftocard (cardoforder_id, staff_id) VALUES
        ($1, $2)`;
      const values = [cardoforder_id, staff_id];
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
      return res.status(400).send("Error: Failed to create record" + e.message);
    }
  }
  async getAll(req, res) {
    //allow only for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.acces !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const sql = "SELECT * FROM stafftocard";
      pool.query(sql, [], (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        res.json(result.rows);
      });
    } catch (e) {
      return res
        .status(400)
        .send("Error: Failed to get all records" + e.message);
    }
  }
  async getOne(req, res) {
    //allow only for trusted user
    try {
      const cardoforder_id = req.params.id;
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader); // Проверяем на accesToken, получаем права доступа и user дату
      if (!userInfo) {
        return res.status(400).send("Acces denied");
      }
      if (userInfo.acces === "client") {
        const CLIENT_ID = userInfo.client.id;
        const cardDetails = await CardRepository.getClientData(cardoforder_id); // получаем из карточки заказа клиент id
        const expectedClientData = cardDetails.client_id;
        if (CLIENT_ID !== expectedClientData)
          return res.status(400).send("Acces denied");
      }
      const sql = "SELECT * FROM stafftocard WHERE cardoforder_id = $1";
      pool.query(sql, [cardoforder_id], (err, result) => {
        if (err) {
          console.error(err.message);
          return res.status(400).json({ error: "Invalid syntax" }); // Ошибка базы данных
        }
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "Relation not found" }); // Пользователь не найден
        }
        res.json(result.rows);
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
      if (!userInfo || userInfo.acces !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const sql_count = "SELECT COUNT(*) FROM stafftocard";
      pool.query(sql_count, (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        const rowCount = result.rows[0].count; // Получить количество записей из результата запроса
        if (rowCount === "0") {
          return res.status(400).send("Error: Table is empty!");
        }
        const sql_delete = "DELETE FROM stafftocard";
        pool.query(sql_delete, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          res.send("All records deleted successfully!");
        });
      });
    } catch (e) {
      return res.status(400).send("Error: Failed to delete record" + e.message);
    }
  }
  async deleteOne(req, res) {
    //allow only for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.acces !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const cardoforder_id = req.params.id;
      const sql_exist = `SELECT cardoforder_id FROM stafftocard WHERE cardoforder_id = $1`;
      pool.query(sql_exist, [cardoforder_id], (err, result) => {
        if (err) {
          return res.status(400).send("Error " + err.message);
        }
        if (result.rows.length === 0) {
          return res.status(400).send("Error: Relation not found!");
        }
        const sql_delete = `DELETE FROM stafftocard WHERE cardoforder_id = $1`;
        pool.query(sql_delete, [cardoforder_id], (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          res.send("Your record was deleted successfully!");
        });
      });
    } catch (e) {
      return res.status(400).send("Error: Failed to delete record" + e.message);
    }
  }
  async deleteOneStaff(req, res) {
    //allow only for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.acces !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const { cardoforder_id, staff_id } = req.body;
      const sql_exist = `SELECT * FROM stafftocard WHERE cardoforder_id = $1 AND staff_id = $2 `;
      pool.query(sql_exist, [cardoforder_id, staff_id], (err, result) => {
        if (err) {
          return res.status(400).send("Error " + err.message);
        }
        if (result.rows.length === 0) {
          return res.status(404).send("Error: Relation not found!");
        }
        const sql_delete = `DELETE FROM stafftocard WHERE cardoforder_id = $1 AND staff_id = $2`;
        pool.query(sql_delete, [cardoforder_id, staff_id], (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          res.send("Relation deleted successfully!");
        });
      });
    } catch (e) {
      return res
        .status(400)
        .send("Error: Failed to delete relation" + e.message);
    }
  }
  async update(req, res) {
    //allow only for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.acces !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const { cardoforder_id, staff_id, new_staff_id } = req.body;
      const sql_exist = `SELECT * FROM stafftocard WHERE cardoforder_id = $1 AND staff_id = $2`;
      pool.query(sql_exist, [cardoforder_id, staff_id], (err, result) => {
        if (err) {
          console.error(err.message);
          return res.status(400).send("Error: Database error! " + err.message);
        }
        if (result.rows.length === 0) {
          return res.status(400).send("Error: Relation not found!");
        }
        // Обновляем запись
        const sql_update = `UPDATE stafftocard SET staff_id = $3 WHERE cardoforder_id = $1 AND staff_id = $2`;
        pool.query(
          sql_update,
          [cardoforder_id, staff_id, new_staff_id],
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
    } catch (e) {
      return res
        .status(400)
        .send("Error: Failed to update relation" + e.message);
    }
  }
}
module.exports = new StaffToCardController();
