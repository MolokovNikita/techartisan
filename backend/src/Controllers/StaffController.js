const pool = require('../Config/ormconfig');

class StaffController {
    async create(req, res) {
        let { id, f_name, l_name, login, pass, hired, dismissed } = req.body;
        const sql_insert = `INSERT INTO staff (id, f_name, l_name, login, pass, hired, dismissed) VALUES
        ($1, $2, $3, $4, $5, $6, $7)`;
        const values = [id, f_name, l_name, login, pass, hired, dismissed];
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
        const sql = "SELECT * FROM staff";
        pool.query(sql, [], (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            res.json(result.rows);
        });
    }

    async getOne(req, res) {
        const id = req.params.id;
        const sql = "SELECT * FROM staff WHERE id = $1";
        pool.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(400).send("Error: Database error!");
            }
            if (result.rows.length === 0) {
                return res.status(404).send("Error: Staff member not found!");
            }
            res.json(result.rows[0]);
        });
    }

    async update(req, res) {
        const {  f_name, l_name, login, pass, hired, dismissed, id  } = req.body;
        const sql_exist = `SELECT id FROM staff WHERE id = $7`;
        pool.query(sql_exist, [id], (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(400).send("Error: Database error! " + err.message);
            }
            if (result.rows.length === 0) {
                return res.status(404).send("Error: Staff member not found!");
            }
            const sql_update = `UPDATE staff SET f_name = $1, l_name = $2, login = $3, pass = $4, hired = $5, dismissed = $6 WHERE id = $7`;
            pool.query(sql_update, [f_name, l_name, login, pass, hired, dismissed, id], (err, result) => {
                if (err) {
                    console.error(err.message);
                    return res.status(400).send("Error: Failed to update staff member! " + err.message);
                }
                res.send("Staff member updated successfully!");
            });
        });
    }

    async deleteOne(req, res) {
        const id = req.params.id;
        const sql_exist = `SELECT id FROM staff WHERE id = $1`;
        pool.query(sql_exist, [id], (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(400).send("Error: Database error! " + err.message);
            }
            if (result.rows.length === 0) {
                return res.status(404).send("Error: Staff member not found!");
            }
            const sql_delete = `DELETE FROM staff WHERE id = $1`;
            pool.query(sql_delete, [id], (err, result) => {
                if (err) {
                    console.error(err.message);
                    return res.status(400).send("Error: Failed to delete staff member! " + err.message);
                }
                res.send("Staff member deleted successfully!");
            });
        });
    }
    async deleteAll(req, res) {
        const sql_count = "SELECT COUNT(*) FROM staff"; // Подсчитать количество записей в таблице client
        pool.query(sql_count, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            const rowCount = result.rows[0].count; // Получить количество записей из результата запроса
            if (rowCount === '0') {
                return res.status(400).send("Error: Table is empty!");
            }
            const sql_delete = "DELETE FROM staff"; // Удалить все записи из таблицы client
            pool.query(sql_delete, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                res.send("All records deleted successfully!");
            });
        });
    }
}

module.exports = new StaffController();
