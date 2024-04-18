const pool = require('../Config/ormconfig');

class ServiceController{
    async create(req, res) {
        const { id, price, name } = req.body;
        const now = new Date().toISOString(); // Преобразование даты в строку в формате ISO
        const sql_insert = `INSERT INTO services (id, price, name) VALUES
        ($1, $2, $3)`;  
        const values = [id, price, name];
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
        const sql = "SELECT * FROM services";
        pool.query(sql, [], (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            res.json(result.rows);
        });
    }
    async getOne(req, res) {
        const id = req.params.id;
        const sql = "SELECT * FROM services WHERE id = $1";

        pool.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(400).json({ error: "Invalid syntax" }); // Ошибка базы данных
            }
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Service not found" }); // Пользователь не найден
            }
            res.json(result.rows[0]); // Отправка данных пользователя в формате JSON
        });
    }
    async deleteAll(req, res) {
        try {
            const result = await pool.query("SELECT COUNT(*) FROM services");
            const rowCount = result.rows[0].count;
            if (rowCount === '0') {
                return res.status(400).send("Error: Table is empty!");
            }
            await pool.query("DELETE FROM services");
            res.send("All records deleted successfully!");
        } catch (err) {
            console.error(err.message);
            return res.status(400).send("Error: Failed to delete all records! " + err.message);
        }
    }
    
    async deleteOne(req, res) {
        const id = req.params.id;
        try {
            const result = await pool.query(`SELECT id FROM services WHERE id = $1`, [id]);
            if (result.rows.length === 0) {
                return res.status(400).send("Error: Service not found!");
            }
            await pool.query(`DELETE FROM services WHERE id = $1`, [id]);
            res.send("Your record was deleted successfully!");
        } catch (err) {
            console.error(err.message);
            return res.status(400).send("Error: Failed to delete the record! " + err.message);
        }
    }    
    async update(req, res) {
        const {  id, price , name } = req.body;
        // Проверяем, есть ли клиент с указанным id
        const sql_exist = `SELECT id FROM services WHERE id = $1`;
        pool.query(sql_exist, [id], (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(400).send("Error: Database error! " + err.message);
            }
            if (result.rows.length === 0) {
                return res.status(400).send("Error: Service not found!");
            }
            // Обновляем запись клиента
            const sql_update = `UPDATE services SET price = $2, name = $3  WHERE id = $1`;
            pool.query(sql_update, [id, price, name], (err, result) => {
                if (err) {
                    console.error(err.message);
                    return res.status(400).send("Error: Failed to update service record! " + err.message);
                }
                res.send("Serivce record updated successfully!");
            });
        });
    }
}
module.exports = new ServiceController()
