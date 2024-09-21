const pool = require("../config/ormconfig");
const CardRepository = require("../repositories/cardRepository");
const checkAccess = require("../utils/checkAcces");

class OfficesToCardController {
  //secured
  async create(req, res) {
    //allow only for trusted user and staff
    //пользователь может выбрать офис обслуживания для своей карточки заказа
    try {
      const { cardoforder_id, offices_id } = req.body;
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader); // Проверяем на accesToken, получаем права доступа и user дату
      if (!userInfo) {
        return res.status(400).send("Acces denied");
      }
      if (userInfo.acces === "client") {
        const CLIENT_ID = userInfo.client.id;
        const cardDetails = await CardRepository.getClientData(cardoforder_id);
        if (!cardDetails) {
          return res.status(400).send("Card not found");
        } // получаем из карточки заказа клиент id
        const expectedClientData = cardDetails.client_id;
        if (CLIENT_ID !== expectedClientData)
          //проверка id из карточки заказа и id user который обращается
          return res.status(400).send("Acces denied");
      }
      const sql_insert = `INSERT INTO officestocard (offices_id, cardoforder_id) VALUES
        ($1, $2)`;
      const values = [offices_id, cardoforder_id];
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
      const sql = "SELECT * FROM officestocard";
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
    //allow for trsuted user and staff
    try {
      const cardoforder_id = req.params.id;
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader); // Проверяем на accesToken, получаем права доступа и user дату
      if (!userInfo) {
        return res.status(400).send("Acces denied");
      }
      if (userInfo.acces === "client") {
        const CLIENT_ID = userInfo.client.id;
        const cardDetails = await CardRepository.getClientData(cardoforder_id);
        if (!cardDetails) {
          return res.status(400).send("Card not found");
        } // получаем из карточки заказа клиент id
        const expectedClientData = cardDetails.client_id;
        if (CLIENT_ID !== expectedClientData)
          return res.status(400).send("Acces denied");
      }
      const sql = "SELECT * FROM officestocard WHERE cardoforder_id = $1";
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
      const sql_count = "SELECT COUNT(*) FROM officestocard"; // Подсчитать количество записей в таблице client
      pool.query(sql_count, (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        const rowCount = result.rows[0].count; // Получить количество записей из результата запроса
        if (rowCount === "0") {
          return res.status(400).send("Error: Table is empty!");
        }
        const sql_delete = "DELETE FROM officestocard"; // Удалить все записи из таблицы client
        pool.query(sql_delete, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          res.send("All records deleted successfully!");
        });
      });
    } catch (e) {
      return res
        .status(400)
        .send("Error: Failed to delete records" + e.message);
    }
  }
  async deleteOne(req, res) {
    //allow only for staff
    //клиент не может удалять записи из бд, может только менять статус
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.acces !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const card_id = req.params.id;
      const sql_exist = `SELECT cardoforder_id FROM officestocard WHERE cardoforder_id = $1`;
      pool.query(sql_exist, [card_id], (err, result) => {
        if (err) {
          return res.status(400).send("Error " + err.message);
        }
        if (result.rows.length === 0) {
          return res.status(400).send("Error: Relation not found!");
        }
        const sql_delete = `DELETE FROM officestocard WHERE cardoforder_id = $1`;
        pool.query(sql_delete, [card_id], (err, result) => {
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
  async deleteOneOffice(req, res) {
    //allow only for staff
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader);
      if (!userInfo || userInfo.acces !== "staff") {
        return res.status(403).json({ message: "Access denied" });
      }
      const { cardoforder_id, offices_id } = req.body;
      const sql_exist = `SELECT * FROM officestocard WHERE offices_id = $1 AND cardoforder_id = $2 `;
      pool.query(sql_exist, [offices_id, cardoforder_id], (err, result) => {
        if (err) {
          return res.status(400).send("Error " + err.message);
        }
        if (result.rows.length === 0) {
          return res.status(404).send("Error: Relation not found!");
        }
        const sql_delete = `DELETE FROM officestocard WHERE offices_id = $1 AND cardoforder_id = $2`;
        pool.query(sql_delete, [offices_id, cardoforder_id], (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          res.send("Relation deleted successfully!");
        });
      });
    } catch (e) {
      return res.status(400).send("Error: Failed to delete record" + e.message);
    }
  }

  async update(req, res) {
    //клиент может менять офис в том случае если статус заказа - created
    //если же статус заказа другой то запись может менять только staff
    try {
      const { cardoforder_id, offices_id, new_offices_id } = req.body;
      if (offices_id === new_offices_id)
        return res
          .status(400)
          .send("You can't change office_id on the same office_id");
      const authorizationHeader = req.headers.authorization;
      const userInfo = await checkAccess(authorizationHeader); // Проверяем на accesToken, получаем права доступа и user дату
      if (!userInfo) {
        return res.status(400).send("Acces denied");
      }
      if (userInfo.acces === "client") {
        const CLIENT_ID = userInfo.client.id;
        const cardDetails = await CardRepository.getClientData(cardoforder_id);
        if (!cardDetails) {
          return res.status(400).send("Card not found");
        } // получаем из карточки заказа клиент id
        const expectedClientData = cardDetails.client_id;
        if (CLIENT_ID !== expectedClientData)
          return res.status(400).send("Acces denied");
        //далее проверяем статус заказа
        const cardStatus = await CardRepository.getCardStatus(cardoforder_id);
        if (cardStatus.statusoforder_id !== 5) {
          return res
            .status(400)
            .send(
              "Acces denied, please contact with support to change the office",
            );
        }
      }
      // Проверяем, существует ли запись с указанным cardoforder_id и devices_id
      const sql_exist = `SELECT * FROM officestocard WHERE offices_id = $1 AND cardoforder_id = $2`;
      pool.query(sql_exist, [offices_id, cardoforder_id], (err, result) => {
        if (err) {
          console.error(err.message);
          return res.status(400).send("Error: Database error! " + err.message);
        }
        if (result.rows.length === 0) {
          return res.status(400).send("Error: Relation not found!");
        }
        // Обновляем запись
        const sql_update = `UPDATE officestocard SET offices_id = $3 WHERE offices_id = $1 AND cardoforder_id = $2`;
        pool.query(
          sql_update,
          [offices_id, cardoforder_id, new_offices_id],
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
      return res.status(400).send("Error: Failed to update record" + e.message);
    }
  }
}
module.exports = new OfficesToCardController();
