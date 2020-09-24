const _ = require('lodash');

class Phone {
  static _client = null;
  static tableName = 'phones';

  static async bulkCreate(values) {
    const valuesString = values
      .map(
        ({ brand, model, price, quantity = 1 }) =>
          `('${brand}','${model}', ${price}, ${quantity})`
      )
      .join(',');

    const { rows } = await this._client.query(`INSERT INTO ${this.tableName}\n
    ("brand", "model", "price", "quantity")\n
    VALUES ${valuesString}\n
    RETURNING *;`);

    return rows;
  }
}

module.exports = Phone;