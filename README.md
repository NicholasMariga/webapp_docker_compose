   webapp_docker_compose
Learning DevOps: Docker compose



   Node.js & PostgreSQL Web App

This is a simple web application built with Node.js and PostgreSQL, demonstrating how to connect a Node.js server to a PostgreSQL database using the `pg` library. The app fetches and displays data from a PostgreSQL database, and showcases essential web development principles.

     Features

-  PostgreSQL Database : Stores and manages data (e.g., users).
-  Node.js Server : Provides a REST API for accessing and interacting with the database.
-  Web Interface : Displays data fetched from the database in a user-friendly format.

     Technologies Used

-  Node.js : JavaScript runtime built on Chrome's V8 JavaScript engine.
-  PostgreSQL : Open-source relational database system.
-  Express : Fast, unopinionated, minimalist web framework for Node.js.
-  pg : PostgreSQL client for Node.js.

     Prerequisites

Before you can run the app, ensure you have the following installed:

- Node.js (v14 or higher): [Download Node.js](https://nodejs.org/)
- Docker: [Download Docker](https://www.docker.com/get-started)

     Setup and Installation

1. Clone the repository:

       bash
    git clone https://github.com/NicholasMariga/webapp_docker_compose.git
    cd webapp_docker_compose
       

2. Build the Docker containers and start the services:

    docker-compose up --build


    This will:
    - Build and start the Node.js app container.
    - Start the PostgreSQL container.
    - Set up necessary database tables and data.

3. Once the app is running, open your browser and navigate to:

       
    http://localhost:3000
       

    You should see a page displaying data fetched from the PostgreSQL database.

     Configuration

The database configuration is handled using environment variables in the `docker-compose.yml` file. These include:

-  POSTGRES_USER : The username for the PostgreSQL database (default: `postgres`).
-  POSTGRES_PASSWORD : The password for the PostgreSQL user (default: `example`).
-  POSTGRES_DB : The name of the database to create (default: `testdb`).

The app connects to the database using the following configuration in `app/index.js`:

   javascript
const client = new Client({
  host: 'db', // refers to service name in docker-compose
  user: 'postgres',
  password: 'example',
  database: 'testdb'
});
