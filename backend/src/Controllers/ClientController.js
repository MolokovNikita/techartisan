const pool = require('../Config/ormconfig');

class ClientController {
    async create(req, res) {
        const { id, f_name, l_name, login, pass, email } = req.body;
        const now = new Date().toISOString(); // Преобразование даты в строку в формате ISO
        const sql_insert = `INSERT INTO client (id, f_name, l_name, login, pass, email, created) VALUES
        ($1, $2, $3, $4, $5, $6, $7)`;
        const values = [id, f_name, l_name, login, pass, email, now];
        pool.query(sql_insert, values, (err, result) => {
            if (err) {
                if (err.code === '23505') { // код ошибки 23505 обозначает конфликт уникальности
                    return res.status(400).send("Conflict: Data already exists");
                }
                console.error(err.message);
                return res.status(400).send("Bad request - " + err.message);
            }
            res.send("Data inserted successfully!");
        });
    }
    async getAll(req, res) {
        const sql = "SELECT * FROM client";
        pool.query(sql, [], (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            // Преобразование даты и времени в нужный часовой пояс
            const formattedData = result.rows.map(row => ({
                ...row,
                created: new Date(row.created).toLocaleString('en-US', { timeZone: 'Europe/Moscow' }) // Замените 'Europe/Moscow' на ваш часовой пояс
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
    
            // Преобразование даты и времени в нужный часовой пояс
            const formattedData = {
                ...result.rows[0],
                created: new Date(result.rows[0].created).toLocaleString('en-US', { timeZone: 'Europe/Moscow' }) // Замените 'Europe/Moscow' на ваш часовой пояс
            };
            res.json(formattedData); // Отправка данных пользователя в формате JSON
        });
    }
    
    async deleteAll(req, res) {
        const sql_count = "SELECT COUNT(*) FROM client"; // Подсчитать количество записей в таблице client
        pool.query(sql_count, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            const rowCount = result.rows[0].count; // Получить количество записей из результата запроса
            if (rowCount === '0') {
                return res.status(400).send("Error: Table is empty!");
            }
            const sql_delete = "DELETE FROM client"; // Удалить все записи из таблицы client
            pool.query(sql_delete, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                res.send("All records deleted successfully!");
            });
        });
    }
    async deleteOne(req, res) {
        const id = req.params.id;
        const sql_exist = `SELECT id FROM client WHERE id = $1`;
        pool.query(sql_exist, [id], (err, result) => {
            if (err) {
                return res.status(400).send("Error " + err.message);
            }
            if (result.rows.length === 0) {
                return res.status(400).send("Error: Client not found!");
            }
            const sql_delete = `DELETE FROM client WHERE id = $1`;
            pool.query(sql_delete, [id], (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                res.send("Your record was deleted successfully!");
            });
        });
    }
    async update(req, res) {
        const { f_name, l_name, login, pass, email, created, deleted, id } = req.body;
        // Проверяем, есть ли клиент с указанным id
        const sql_exist = `SELECT id FROM client WHERE id = $8`;
        pool.query(sql_exist, [id], (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(400).send("Error: Database error! " + err.message);
            }
            if (result.rows.length === 0) {
                return res.status(400).send("Error: Client not found!");
            }
            // Обновляем запись клиента
            const sql_update = `UPDATE client SET f_name = $1, l_name = $2, login = $3, pass = $4, email = $5, created = $6, deleted = $7 WHERE id = $8`;
            pool.query(sql_update, [f_name, l_name, login, pass, email, created, deleted, id], (err, result) => {
                if (err) {
                    console.error(err.message);
                    return res.status(400).send("Error: Failed to update client record! " + err.message);
                }
                res.send("Client record updated successfully!");
            });
        });
    }
}
module.exports = new ClientController()
