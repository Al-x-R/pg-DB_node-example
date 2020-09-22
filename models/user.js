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
        ({ name: { first, last }, email }) =>
          `('${first}','${last}','${email}')`
      )
      .join(',');
    await this._client.query(
      `INSERT INTO ${this.tableName} ("firstName", "lastName", "email")\n
      VALUES ${valuesString};`
    );
  }
}

module.exports = User;