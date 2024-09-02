const pool = require("../config/ormconfig.js");
const bcrypt = require("bcryptjs");
const ClientRepository = require("../repositories/clientRepository.js");
const TokenService = require("../services/token.js");
const ApiError = require("../exceptions/apiError.js");
class ClientService {
  async registration(f_name, pass, email, fingerprint) {
    // const candidate = ClientRepository.getClientData(email);
    // if(candidate){
    //   throw new ApiError.BadRequet(`Пользователь с почтовым адресом ${email} уже существует`);
    // }
    // const hashedPassword = bcrypt.hashSync(pass, 8);
    // const client = ClientRepository.createClient(f_name, hashedPassword, email);
    // const { fingerprint } = req;
    // const payload = { id: client.id, email};
    // const tokens = TokenService.generateTokens(payload);
    // await TokenService.saveToken({userId:client.id, tokens.refreshToken, fingerprint})
    // return{ ...tokens, clientData: client }
  }

  async login(req, res, next) {
    try {
    } catch (e) {}
  }
  async logout(req, res, next) {
    try {
    } catch (e) {}
  }
  async refresh(req, res, next) {
    try {
    } catch (e) {}
  }
  async getUers(req, res, next) {
    try {
    } catch (e) {}
  }

  async getAll(req, res) {
    const sql = "SELECT * FROM client";
    pool.query(sql, [], (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      // Преобразование даты и времени в нужный часовой пояс
      const formattedData = result.rows.map((row) => ({
        ...row,
        created: row.created
          ? new Date(row.created).toLocaleString("en-US", {
              timeZone: "Europe/Moscow",
            })
          : null, // Замените 'Europe/Moscow' на ваш часовой пояс
      }));

      res.json(formattedData);
    });
  }
  async getOne(req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM client WHERE id = $1";
    pool.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(400).json({ error: "Invalid syntax" }); // Ошибка базы данных
      }
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" }); // Пользователь не найден
      }
      res.json(result.rows[0]);
    });
  }

  // async deleteAll(req, res) {
  //   try {
  //     const result = await pool.query("SELECT COUNT(*) FROM client");
  //     const rowCount = result.rows[0].count;
  //     if (rowCount === "0") {
  //       return res.status(400).send("Error: Table is empty!");
  //     }
  //     await pool.query("DELETE FROM client");
  //     res.send("All records deleted successfully!");
  //   } catch (err) {
  //     console.error(err.message);
  //     return res
  //       .status(400)
  //       .send("Error: Failed to delete all records! " + err.message);
  //   }
  // }
  async deleteOne(req, res) {
    const id = req.params.id;
    try {
      const result = await pool.query(`SELECT id FROM client WHERE id = $1`, [
        id,
      ]);
      if (result.rows.length === 0) {
        return res.status(400).send("Error: Client not found!");
      }
      await pool.query(`DELETE FROM client WHERE id = $1`, [id]);
      res.send("Your record was deleted successfully!");
    } catch (err) {
      console.error(err.message);
      return res
        .status(400)
        .send("Error: Failed to delete the record! " + err.message);
    }
  }
  async updatePassword(req, res) {
    const { email, pass, newpass } = req.body;
    const userData = await UserRepository.getUserData(email);
    if (!userData) {
      return res
        .status(400)
        .send(`("Неудалось найти пользователя с таким email!`);
    }
    const isPasswordValid = bcrypt.compareSync(pass, userData.pass);
    if (!isPasswordValid) {
      return res.status(400).send("Указан неверный пароль");
    }
    const hashedPassword = bcrypt.hashSync(newpass, 8);
    try {
      await pool.query(`UPDATE client SET pass = $1 WHERE email = $2`, [
        hashedPassword,
        email,
      ]);
      res.send("Password updated successfully!");
    } catch (e) {
      return res.status(400).send(`Error: Failed to update password! ${e}`);
    }
  }
  async recoverPassword(req, res) {
    const { email, pass, code } = req.body;
    const userData = await UserRepository.getUserData(email);
    if (!userData) {
      return res
        .status(400)
        .send(`("Неудалось найти пользователя с таким email!`);
    }
    const storedCode =
      await VerificationRepository.getStoredVerificationCode(email);
    if (!storedCode) {
      return res
        .status(400)
        .send(`("Неудалось найти код верификации у данного пользователя!`);
    }
    const isCodeValid = bcrypt.compareSync(code, storedCode.code);
    if (!isCodeValid) {
      return res.status(400).send("Указан неверный код");
    }
    const hashedPassword = bcrypt.hashSync(pass, 8);
    try {
      await pool.query(`UPDATE client SET pass = $1 WHERE email = $2`, [
        hashedPassword,
        email,
      ]);
      await VerificationRepository.clearStoredVerificationCode(email);
      res.send("Пароль был успешно изменен!");
    } catch (e) {
      return res.status(400).send(`Ошибка: Не удалось поменять пароль! ${e}`);
    }
  }
  async update(req, res) {
    const { f_name, l_name, email, created, deleted, phone_number, id } =
      req.body;
    // Проверяем, есть ли клиент с указанным id
    const sql_exist = `SELECT id FROM client WHERE id = $1`;
    pool.query(sql_exist, [id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(400).send("Error: Database error! " + err.message);
      }
      if (result.rows.length === 0) {
        return res.status(400).send("Error: Client not found!");
      }
      // Обновляем запись клиента
      if (created || deleted) {
        const sql_update = `UPDATE client SET f_name = $1, l_name = $2, email = $3, created = $4, deleted = $5, phone_number = $6 WHERE id = $7`;
        pool.query(
          sql_update,
          [f_name, l_name, email, created, deleted, phone_number, id],
          (err, result) => {
            if (err) {
              console.error(err.message);
              return res
                .status(400)
                .send("Error: Failed to update client record! " + err.message);
            }
            res.send("Client record updated successfully!");
          },
        );
      } else {
        const sql_update = `UPDATE client SET f_name = $1, l_name = $2, email = $3, phone_number = $4 WHERE id = $5`;
        pool.query(
          sql_update,
          [f_name, l_name, email, phone_number, id],
          (err, result) => {
            if (err) {
              console.error(err.message);
              return res
                .status(400)
                .send("Error: Failed to update client record! " + err.message);
            }
            res.send("Client record updated successfully!");
          },
        );
      }
    });
  }
}
module.exports = new ClientService();
