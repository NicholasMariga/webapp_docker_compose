const express = require('express');
const { Client } = require('pg');
const app = express();
const PORT = 3000;

// Initialize the PostgreSQL client
const client = new Client({
  host: 'db', // Refers to the service name in docker-compose
  user: 'postgres',
  password: 'example',
  database: 'testdb'
});

// Connect to the database
client.connect()
  .then(() => console.log('Connected to PostgreSQL!'))
  .catch(err => console.error('Connection error', err.stack));

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

// Call the function to create the table
createTable();

// Middleware to parse JSON requests
app.use(express.json());

// Route to create a new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }

  const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
  const values = [name, email];

  try {
    const result = await client.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting data:', err.stack);
    res.status(500).send('Error inserting data into the database');
  }
});

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error querying data:', err.stack);
    res.status(500).send('Error querying the database');
  }
});

// Route to update a user's details by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }

  const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
  const values = [name, email, id];

  try {
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating data:', err.stack);
    res.status(500).send('Error updating user');
  }
});

// Route to delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting data:', err.stack);
    res.status(500).send('Error deleting user');
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello from Node.js and PostgreSQL!');
});

// Start the server
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
