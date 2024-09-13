const pool = require("../config/ormconfig");
class CardRepository {
  static async getClientData(cardId) {
    const response = await pool.query(
      "SELECT * FROM cardoforder WHERE id = $1",
      [cardId],
    );

    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  }
  static async getAlClientCards(clientId) {
    const response = await pool.query(
      "SELECT * FROM cardoforder WHERE client_id = $1",
      [clientId],
    );

    if (!response.rows.length) {
      return null;
    }
    return response.rows;
  }
}

module.exports = CardRepository;
