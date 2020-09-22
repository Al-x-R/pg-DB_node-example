const _ = require('lodash')

class User {
  static _client = null;
  static tableName = 'users';

  static async findAll() {
    const { rows } = await this._client.query(
      `SELECT * FROM ${this.tableName}`
    );
    return rows;
  }

  static async bulkCreate(values) {
    const valuesString = values
      .map(
        ({ name: { first, last }, email, gender }) =>
          `('${first}','${last}','${email}', '${
            gender === 'male'
          }', '${`${_.random(1950, 2010)}/${_.random(1, 12)}/${_.random(
            1,
            28
          )}`}')`
      )
      .join(',');
    await this._client.query(
      `INSERT INTO ${this.tableName} ("firstName", "lastName", "email", "isMale", "birthday")\n
      VALUES ${valuesString};`
    );
  }
}

module.exports = User;