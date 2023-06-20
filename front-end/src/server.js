const fastify = require('fastify')();
const mysql = require('mysql2/promise');

fastify.register(require('fastify-cors'));
fastify.register(require('fastify-formbody'));

const dbConfig = {
  host: 'localhost',
  user: 'root@localhost', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'signup', // replace with your MySQL database name
};

async function initDb() {
  const connection = await mysql.createConnection(dbConfig);
  console.log('Connected to database');

  // Create the "users" table if it doesn't exist
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL,
      phone_number VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      postal_code VARCHAR(255) NOT NULL
    )
  `);

  return connection;
}

fastify.post('/api/signup', async (request, reply) => {
  const userData = request.body;
  const connection = await mysql.createConnection(dbConfig);

  try {
    const [results] = await connection.execute(
      `
        INSERT INTO users (email, password, first_name, last_name, country, phone_number, address, postal_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.country,
        userData.phoneNumber,
        userData.address,
        userData.postalCode,
      ]
    );
    console.log('Inserted user data: ', results);
    reply.send('User data inserted successfully');
  } catch (error) {
    console.error('Error inserting user data: ', error);
    reply.code(500).send('Error inserting user data');
  } finally {
    await connection.end();
  }
});

async function start() {
  const connection = await initDb();
  fastify.decorate('db', connection);
  console.log("meow")
  try {
    await fastify.listen(3001);
    console.log('Server listening on port 3001');
  } catch (error) {
    console.error('Error starting server: ', error);
    process.exit(1);
  }
}

start();
