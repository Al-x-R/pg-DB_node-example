const dbConfig = require('./../configs/db.json');
const User = require('./user');
const Phone = require('./phone');
const { Client } = require('pg');

const dbClient = new Client(dbConfig);

dbClient.connect();

User._client = dbClient;
Phone._client = dbClient;

module.exports = {
  client: dbClient,
  User,
  Phone,
};