const pool = require("../config/ormconfig.js");
const bcrypt = require("bcryptjs");
const ClientRepository = require("../repositories/clientRepository.js");
const TokenService = require("../services/token.js");
const ApiError = require("../exceptions/apiError.js");
const UserRepository = require("../repositories/user.js");
class ClientService {
  async registration(f_name, pass, email, fingerprint) {
    const candidate = ClientRepository.getClientData(email);
    if(candidate){
      throw new ApiError.BadRequet(`Пользователь с почтовым адресом ${email} уже существует`);
    }
    const hashedPassword = bcrypt.hashSync(pass, 8);
    const client = ClientRepository.createClient(f_name, hashedPassword, email);
    const payload = { id: client.id, email};
    const tokens = TokenService.generateTokens(payload);
    await TokenService.saveToken({userId:client.id, refreshToken: tokens.refreshToken, fingerprint})
    return{ ...tokens, clientData: client }
  }

  async login(email, password, fingerprint) {
      const client = await ClientRepository.getClientData(email);
      if(!client){
        throw ApiError.BadRequest(`Пользователь с почтовым адреcom ${email} не найден`)
      }
    const isPasswordValid = bcrypt.compareSync(password, client.password);
    if(!isPasswordValid){
      throw new ApiError.BadRequest('Неверный пароль')
    }
    const payload = { id: client.id, email };
    const tokens = TokenService.generateTokens(payload);
    await TokenService.saveToken(client.id, tokens.refreshToken, fingerprint);
    return {...tokens, client: client}
  }

  async logout(refreshToken) {
      const token = await TokenService.removeToken(refreshToken);
      return token;
  }
  async refresh(refreshToken, fingerprint) {
    if(!refreshToken){
      throw ApiError.UnauthorizedError()
    }
    const clientData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromBd = await TokenService.findToken(refreshToken);
    if(!clientData || !tokenFromBd){
      throw  ApiError.UnauthorizedError();
    }
    if (tokenFromBd.finger_print !== fingerprint.hash) 
    {
      console.log("Попытка несанкционированного обновления токенов");
      throw ApiError.BadRequest("Попытка несанкционированного обновления токенов");
    }

    const client = await UserRepository.getUserData(clientData.email);
    const payload = { id: client.id, email: client.email };
    const tokens = TokenService.generateTokens(payload);
    await TokenService.saveToken(payload.id, tokens.refreshToken);
    return  {...tokens, client: client}
  }

  async getAllClients(req, res, next) {
      const clients = await UserRepository.getAll();
      return clients;
  }

  // async deleteOne(req, res) {
  //   const id = req.params.id;
  //   try {
  //     const result = await pool.query(`SELECT id FROM client WHERE id = $1`, [
  //       id,
  //     ]);
  //     if (result.rows.length === 0) {
  //       return res.status(400).send("Error: Client not found!");
  //     }
  //     await pool.query(`DELETE FROM client WHERE id = $1`, [id]);
  //     res.send("Your record was deleted successfully!");
  //   } catch (err) {
  //     console.error(err.message);
  //     return res
  //       .status(400)
  //       .send("Error: Failed to delete the record! " + err.message);
  //   }
  // }
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
