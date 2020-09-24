const _ = require('lodash');

class User {
  static _client = null;
  static tableName = 'users';

  static async findAll() {
    const { rows } = await this._client.query(
      `SELECT * FROM ${this.tableName}`
    );
    return rows;
  }

  /**
   *
   * @param {object[]} values
   * @returns {Promise<object[]>}
   */
  static async bulkCreate(values) {
    const valuesString = values
      .map(
        ({ name: { first, last }, email, gender }, index) =>
          `('${first}','${last}','${
            email || `test.email${first}${index}@gmail.com`
          }', '${gender === 'male'}', '${`${_.random(1950, 2010)}/${_.random(
            1,
            12
          )}/${_.random(1, 28)}`}')`
      )
      .join(',');

    const { rows } = await this._client.query(
      `INSERT INTO ${this.tableName} ("firstName", "lastName", "email", "isMale", "birthday")\n
      VALUES ${valuesString}\n
      RETURNING *;`
    );
    return rows;
  }
}

module.exports = User;