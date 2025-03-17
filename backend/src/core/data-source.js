const { MongoClient } = require("mongodb");

const connection = process.env.MONGODB_CONNECTION ?? 'mongodb://localhost:27017/teste';

const dataSource = new MongoClient(connection);

module.exports = dataSource;