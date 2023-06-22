

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URL; // Replace with your MongoDB connection string
const dbName = process.env.DB_NAME; // Replace with your database name
// const clName= "note-app-clc";

// zOhmxgIUBCUXDmYR9YXKoSVweJr9ar6hPg7ub7wDYndKmjOop6dobMbKjNmqYAAr
// https://data.mongodb-api.com/app/data-hmjxa/endpoint/data/v1
// apikey
// 649454b2b335d31cdf7a7f0d

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);





module.exports = {
  client,dbName
};



const noteappmgdb = require('./Public/noteappbackendmgdb');
app.use('/', noteappmgdb);



// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'noteapp',
// });

// const connection = mysql.createConnection({
//   host: process.env.host,
//   user: process.env.db_name,
//   password: process.env.DB_PASSWORD,
//   database: process.env.db_name,
//   connectTimeout: 15000
// });


// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }
//   console.log('Connected to the database');
// });
// module.exports = connection;

// const noteapp = require('./Public/noteappbackend');
// app.use('/', noteapp);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());






app.listen(3001, () => {
  console.log(`Example app listening on port 3001`);
});

