

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(express.json());



// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'noteapp',
// });

const connection = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7627513',
  password: process.env.DB_PASSWORD,
  database: 'sql7627513',
  connectTimeout: 15000
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});
module.exports = connection;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




const noteapp = require('./Public/noteappbackend');
app.use('/', noteapp);




app.listen(3001, () => {
  console.log(`Example app listening on port 3001`);
});

