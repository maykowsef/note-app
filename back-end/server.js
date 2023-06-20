

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'randomwordgenerator',
// });


// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'noteapp',
// });

const connection = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7627513',
  password: 'NYDUXtlmxS',
  database: 'sql7627513',
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


// const rwg = require('./Public/RandomWordGenerator');
// app.use('/', rwg);

const noteapp = require('./Public/noteappbackend');
app.use('/', noteapp);


const chat = require('./Public/chat');
app.use('/', chat);











app.listen(3001, () => {
  console.log(`Example app listening on port 3001`);
});



// const express = require('express');
// const app = express();
// const { exec } = require('child_process');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

// app.use(cors()); // Enable CORS for all routes

// app.get('/download', (req, res) => {
//   const youtubeURL = req.query.url; // Assuming the URL is passed as a query parameter named 'url'
// console.log("heylo")
// exec(`youtube-dl --no-check-certificate -o 'videos/%(title)s.%(ext)s' ${youtubeURL}`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error: ${error.message}`);
//       res.status(500).json({ error: 'Failed to download video' });
//     } else {
//       console.log('Video downloaded successfully!');

//       // Extract the downloaded file name from the output
//       const regex = /Destination: (.+)/;
//       const matches = regex.exec(stdout);
//       const fileName = matches && matches[1];

//       if (fileName) {
//         const filePath = path.join(__dirname, fileName);
//         const fileStream = fs.createReadStream(filePath);
//         res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//         res.setHeader('Content-Type', 'video/mp4');
//         fileStream.pipe(res);
//       } else {
//         res.status(500).json({ error: 'Failed to retrieve video file' });
//       }
//     }
//   });
// });

// app.listen(3002, () => {
//   console.log('Server is running on port 3001');
// });
