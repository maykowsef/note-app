
const express = require('express');
const router = express.Router();
const connection = require('../server');

const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());
fs.readFile('words.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    const words = data.split('\n').map((word) => word.trim()); // Remove leading/trailing whitespace
  console.log(words.length)
    // Insert words into the database
    const insertQuery = 'INSERT INTO Words (word) VALUES ?';
    const values = words.map((word) => [word]);

    connection.query(insertQuery, [values], (error, results) => {
      if (error) {
        console.error('Error inserting data:', error);
      } else {
        console.log('Data inserted successfully!');
      }


    });
  });




  router.get('/random-word', (req, res) => {
    const selectQuery = 'SELECT word FROM Words ORDER BY RAND() LIMIT 1';

    connection.query(selectQuery, (error, results) => {
      if (error) {
        console.error('Error retrieving random word:', error);
        res.status(500).send('Error retrieving random word');
      } else {
        const randomWord = results[0].word;
        res.json({ word: randomWord });
      }
    });
  });

module.exports = router;

