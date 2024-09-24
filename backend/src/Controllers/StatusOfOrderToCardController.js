const pool = require("../config/ormconfig");
const checkAccess = require("../utils/checkAcces");
const CardRepository = require("../repositories/cardRepository");

class StatusOfOrderToCardController {
  async create(req, res) {
    //
    //secured
    try {
      //клиент может только задать статус "Создан" менять как либо по другому не может
      //сотрудник может менять как захочет
      const { cardoforder_id, statusoforder_id } = req.body;
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader); // Проверяем на accesToken, получаем права доступа и user дату
      if (!userInfo) {
        return res.status(400).send("Acces denied");
      }
      if (userInfo.access === "client") {
        if (statusoforder_id != 5) {
          return res.status(400).send("You can only set status to 'Created'");
        }
        const CLIENT_ID = userInfo.client.id; // user ID from acces token
        const cardDetails = await CardRepository.getClientData(cardoforder_id); // получаем из карточки заказа клиент id
        if (!cardDetails) {
          return res.status(400).send("Card not found");
        }
        const expectedClientData = cardDetails.client_id;
        if (CLIENT_ID !== expectedClientData)
          return res.status(400).send("Acces denied");
      }
      const sql_insert = `INSERT INTO statusofordertocard (cardoforder_id, statusoforder_id) VALUES
        ($1, $2)`;
      const values = [cardoforder_id, statusoforder_id];
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
      if (!userInfo || userInfo.access !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const sql = "SELECT * FROM statusofordertocard";
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
    //allow for staff and trusted users
    try {
      const cardoforder_id = req.params.id;
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader); // Проверяем на accesToken, получаем права доступа и user дату
      if (!userInfo) {
        return res.status(400).send("Acces denied");
      }
      if (userInfo.access === "client") {
        const CLIENT_ID = userInfo.client.id; // user ID from acces token
        const cardDetails = await CardRepository.getClientData(cardoforder_id); // получаем из карточки заказа клиент id
        if (!cardDetails) {
          return res.status(400).send("Card not found");
        }
        const expectedClientData = cardDetails.client_id;
        if (CLIENT_ID !== expectedClientData)
          return res.status(400).send("Acces denied");
      }
      const sql = "SELECT * FROM statusofordertocard WHERE cardoforder_id = $1";
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
    } catch (e) {
      return res.status(400).send("Error: Failed to get one record" + e.messag);
    }
  }
  async deleteAll(req, res) {
    //alow for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.access !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const result = await pool.query(
        "SELECT COUNT(*) FROM statusofordertocard",
      );
      const rowCount = result.rows[0].count;
      if (rowCount === "0") {
        return res.status(400).send("Error: Table is empty!");
      }
      await pool.query("DELETE FROM statusofordertocard");
      res.send("All records deleted successfully!");
    } catch (err) {
      return res
        .status(400)
        .send("Error: Failed to delete all records! " + err.message);
    }
  }

  async deleteOne(req, res) {
    //allow for staff
    try {
      const cardoforder_id = req.params.id;
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.access !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const result = await pool.query(
        `SELECT cardoforder_id FROM statusofordertocard WHERE cardoforder_id = $1`,
        [cardoforder_id],
      );
      if (result.rows.length === 0) {
        return res.status(400).send("Error: Relation not found!");
      }
      await pool.query(
        `DELETE FROM statusofordertocard WHERE cardoforder_id = $1`,
        [cardoforder_id],
      );
      res.send("Your record was deleted successfully!");
    } catch (err) {
      return res
        .status(400)
        .send("Error: Failed to delete the record! " + err.message);
    }
  }

  async deleteOneStatus(req, res) {
    //allow  for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.access !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const { cardoforder_id, statusoforder_id } = req.body;
      const sql_exist = `SELECT * FROM statusofordertocard WHERE cardoforder_id = $1 AND statusoforder_id = $2 `;
      pool.query(
        sql_exist,
        [cardoforder_id, statusoforder_id],
        (err, result) => {
          if (err) {
            return res.status(400).send("Error " + err.message);
          }
          if (result.rows.length === 0) {
            return res.status(404).send("Error: Relation not found!");
          }
          const sql_delete = `DELETE FROM statusofordertocard WHERE cardoforder_id = $1 AND statusoforder_id = $2`;
          pool.query(
            sql_delete,
            [cardoforder_id, statusoforder_id],
            (err, result) => {
              if (err) {
                return console.error(err.message);
              }
              res.send("Relation deleted successfully!");
            },
          );
        },
      );
    } catch (e) {
      return res
        .status(400)
        .send("Error: Failed to delete the record! " + err.message);
    }
  }

  async update(req, res) {
    //allow fot trusted users and staff
    //клиент может поменять статус только на отменен и только если текущий статус Создан
    try {
      const { cardoforder_id, statusoforder_id, new_statusoforder_id } =
        req.body;
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader); // Проверяем на accesToken, получаем права доступа и user дату
      if (!userInfo) {
        return res.status(400).send("Acces denied");
      }
      if (userInfo.access === "client") {
        if (new_statusoforder_id !== 6) {
          return res
            .status(400)
            .send(
              "Acces denied, you can only change order status on 'Canceled'",
            );
        }
        if (statusoforder_id !== 5) {
          return res
            .status(400)
            .send(
              "Acces denied, you can only change order with status 'Created'",
            );
        }

        const CLIENT_ID = userInfo.client.id; // user ID from acces token
        const cardDetails = await CardRepository.getClientData(cardoforder_id); // получаем из карточки заказа клиент id
        if (!cardDetails) {
          return res.status(400).send("Card not found");
        }
        const expectedClientData = cardDetails.client_id;
        if (CLIENT_ID !== expectedClientData)
          return res.status(400).send("Acces denied");
      }
      const sql_exist = `SELECT * FROM statusofordertocard WHERE cardoforder_id = $1 AND statusoforder_id = $2`;
      pool.query(
        sql_exist,
        [cardoforder_id, statusoforder_id],
        (err, result) => {
          if (err) {
            console.error(err.message);
            return res
              .status(400)
              .send("Error: Database error! " + err.message);
          }
          if (result.rows.length === 0) {
            return res.status(400).send("Error: Relation not found!");
          }
          // Обновляем запись
          const sql_update = `UPDATE statusofordertocard SET statusoforder_id = $3 WHERE cardoforder_id = $1 AND statusoforder_id = $2`;
          pool.query(
            sql_update,
            [cardoforder_id, statusoforder_id, new_statusoforder_id],
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
        },
      );
    } catch (e) {
      return res
        .status(400)
        .send("Error: Failed to update  the record! " + err.message);
    }
  }
}
module.exports = new StatusOfOrderToCardController();
