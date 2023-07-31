
const { Client } = require('pg');
require('dotenv').config();

const dbClient = new Client({
  connectionString: process.env.DB_URL,
});

dbClient.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the database');
});

module.exports = dbClient;
