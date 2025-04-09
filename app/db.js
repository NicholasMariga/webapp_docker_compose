const { Client } = require('pg');

const client = new Client({
  host: 'db', // Refers to the service name in docker-compose
  user: 'postgres',
  password: 'example',
  database: 'testdb'
});

// Connect to PostgreSQL
const connectDb = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL!');
    await createTable();
  } catch (err) {
    console.error('Connection error', err.stack);
  }
};

// Create a table if it doesn't exist
const createTable = async () => {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE
    );
  `;
  try {
    await client.query(createQuery);
    console.log('Table created or already exists');
  } catch (err) {
    console.error('Error creating table:', err.stack);
  }
};

// Export the client and connection function
module.exports = {
  connectDb,
  client
};
