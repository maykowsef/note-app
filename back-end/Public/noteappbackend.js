const express = require('express');
const router = express.Router();
const connection = require('../server');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Secret key used for signing and verifying tokens
const secretKey = process.env.secret_key;
const IV = process.env.IV;
const algorithm = process.env.algorithm;
const encryptionKey = process.env.ENCRYPTION_KEY;





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
        res.status(409).json({ error: 'username already exist' });

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

  if (!token) {

    return res.status(401).json({ error: 'Unauthorized' });

  }

  jwt.verify(token, secretKey, (err, decoded) => {
    console.log("oekf,ernf")
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = decoded.user_id;
    next();
  });
}

router.get('/protected', verifyToken, (req, res) => {
  // Accessible only if the token is valid

  res.status(200).json({ message: 'Protected route accessed successfully' });
});





router.get('/notes/:user_id', (req, res) => {
  const userId = req.params.user_id;

  connection.query(
    'SELECT * FROM note WHERE user_id = ?  ORDER BY modified_at DESC',
    [userId],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Decrypt the note content before sending it in the response
      if (results.length!==0)
     { const decryptedResults = results.map((result) => {

        let decipher = crypto.createDecipheriv(algorithm,  encryptionKey, IV);

        let decryptedContent= decipher.update(result.content, 'hex', 'utf8');
        decryptedContent += decipher.final('utf8');

        return { ...result, content: decryptedContent };
      });

      res.status(200).json(decryptedResults);
    }}
  );
});

router.post('/notes/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const { title, content } = req.body;



  const cipher = crypto.createCipheriv(algorithm,  encryptionKey,IV);

  let encryptedContent = cipher.update(content, 'utf8', 'hex');
  encryptedContent += cipher.final('hex');


  connection.query(
    'INSERT INTO note (title, content, user_id, modified_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
    [title, encryptedContent, userId],
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


router.put('/notes/:note_id/:user_id', (req, res) => {
  const noteId = req.params.note_id;
  const userId = req.params.user_id;
  const { title, content } = req.body;


  const cipher = crypto.createCipheriv(algorithm,  encryptionKey,IV);

  let encryptedContent = cipher.update(content, 'utf8', 'hex');
  encryptedContent += cipher.final('hex');


  connection.query(
    'UPDATE note SET title = ?, content = ?, modified_at = CURRENT_TIMESTAMP WHERE note_id = ? AND user_id = ?',
    [title, encryptedContent, noteId, userId],
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

router.delete('/notes/:note_id/:user_id', (req, res) => {

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






module.exports = router;
