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

// Secret key used for signing and verifying tokens
const secretKey = 'your-secret-key';

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  connection.query(
    'SELECT * FROM user WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (results.length > 0) {
        const user = results[0];
        console.log(user)
        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          if (isMatch) {
            // Passwords match, generate a token
            const token = jwt.sign({ userId: user.user_id ,userName:user.username}, secretKey);
            res.status(200).json({ message: 'Login successful', token });
            console.log(token)
          } else {
            // Passwords do not match, return error response
            res.status(401).json({ error: 'Invalid credentials' });
          }
        });
      } else {
        // User not found, return error response
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  );
});

// Sign-up route
router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists in the database
  connection.query(
    'SELECT * FROM user WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (results.length > 0) {
        // Username already exists, return error response
        res.status(409).json({ error: 'Username already taken' });
      } else {
        // Hash the password before storing it in the database
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          // Insert the new user into the database
          connection.query(
            'INSERT INTO user (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            (err, results) => {
              if (err) {
                console.error('Error executing MySQL query:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
              }

              // User registration successful
              res.status(200).json({ message: 'Sign up successful' });
            }
          );
        });
      }
    }
  );
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
console.log(token)
  if (!token) {
    console.log("oekf,erfeflekfnf")
    return res.status(401).json({ error: 'Unauthorized' });

  }

  jwt.verify(token, secretKey, (err, decoded) => {
    console.log("oekf,ernf")
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  console.log(decoded.user_id)
    req.userId = decoded.user_id;
    next();
  });
}

router.get('/protected', verifyToken, (req, res) => {
  // Accessible only if the token is valid
  console.log("oklf")
  res.status(200).json({ message: 'Protected route accessed successfully' });
});





router.get('/notes/:user_id', (req, res) => {
  const userId = req.params.user_id; // Access the user ID from req.params.user_id


 console.log(userId)
  connection.query(
    'SELECT * FROM note WHERE user_id = ?  ORDER BY modified_at DESC',
    [userId],
    (err, results) => {
      console.log(results)
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.status(200).json(results);
    }
  );
});



router.post('/notes/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const { title, content } = req.body;

  connection.query(
    'INSERT INTO note (title, content, user_id) VALUES (?, ?, ?)',
    [title, content, userId],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.status(200).json({ message: 'Note saved successfully' });
    }
  );
});

// ...

router.delete('/notes/:note_id/:user_id', (req, res) => {
  console.log('delete')
  const noteId = req.params.note_id;
  const userId = req.params.user_id;

  connection.query(
    'DELETE FROM note WHERE note_id = ? AND user_id = ?',
    [noteId, userId],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (results.affectedRows === 0) {
        // Note not found or user is not authorized
        res.status(404).json({ error: 'Note not found or unauthorized' });
      } else {
        res.status(200).json({ message: 'Note deleted successfully' });
      }
    }
  );
});

router.put('/notes/:note_id/:user_id', (req, res) => {
  const noteId = req.params.note_id;
  const userId = req.params.user_id;
  const { title, content } = req.body;

  connection.query(
    'UPDATE note SET title = ?, content = ?, modified_at = CURRENT_TIMESTAMP WHERE note_id = ? AND user_id = ?',
    [title, content, noteId, userId],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (results.affectedRows === 0) {
        // Note not found or user is not authorized
        res.status(404).json({ error: 'Note not found or unauthorized' });
      } else {
        res.status(200).json({ message: 'Note updated successfully' });
      }
    }
  );
});

module.exports = router;


module.exports = router;