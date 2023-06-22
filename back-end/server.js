

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(express.json());


const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL; // Replace with your MongoDB connection string
const dbName = process.env.DB_NAME; // Replace with your database name

async function connectToMongoDB() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    module.exports = db;
    console.log('Connected to MongoDB');

    app.listen(3002, () => {
      console.log('Example app listening on port 3001');
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

connectToMongoDB();

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'noteapp',
// });

const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.db_name,
  password: process.env.DB_PASSWORD,
  database: process.env.db_name,
  connectTimeout: 15000
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});
// module.exports = connection;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




const noteapp = require('./Public/noteappbackend');
app.use('/', noteapp);




app.listen(3001, () => {
  console.log(`Example app listening on port 3001`);
});

