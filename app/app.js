const express = require('express');
const { Client } = require('pg');
const os = require('os');
const moment = require('moment'); // Install moment.js for easy date formatting

const app = express();
const client = new Client({
  host: 'db', // refers to service name in docker-compose
  user: 'postgres',
  password: 'example',
  database: 'testdb'
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL!'))
  .catch(err => console.error('Connection error', err.stack));

app.use(express.static('public')); // Serve static files (CSS, JS)

app.get('/', async (req, res) => {
  try {
    // Fetch data from database
    const users = await client.query('SELECT name, email FROM users');
    const uptime = formatUptime(os.uptime());
    const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Our App</title>
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <div class="container">
            <header>
              <h1>Welcome to Our Node.js & PostgreSQL App!</h1>
            </header>
            <section class="info">
              <div>
                <p><strong>Server Uptime:</strong> ${uptime}</p>
                <p><strong>Current Date and Time:</strong> ${currentTime}</p>
              </div>
              <h2>Database Data (Users):</h2>
              <ul>
                ${users.rows.length > 0 ? 
                  users.rows.map(user => `<li><strong>${user.name}</strong> - ${user.email}</li>`).join('') : 
                  '<li>No users found.</li>'
                }
              </ul>
            </section>
            <footer>
              <p>Powered by Node.js and PostgreSQL</p>
            </footer>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('<h1>Internal Server Error</h1>');
  }
});

function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} hours, ${minutes} minutes`;
}

app.listen(3000, () => console.log('App running on port 3000'));
