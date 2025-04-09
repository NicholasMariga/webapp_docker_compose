const express = require('express');
const { client } = require('./db');

const router = express.Router();

// Create a new user
router.post('/users', async (req, res) => {
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

// Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error querying data:', err.stack);
    res.status(500).send('Error querying the database');
  }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
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

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
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
router.get('/', (req, res) => {
  res.send('Hello from Node.js and PostgreSQL!');
});

module.exports = router;
