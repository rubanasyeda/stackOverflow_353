'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const nano = require('nano');
const cors = require('cors');

const app = express();
const PORT = 8080;
const HOST = '0.0.0.0';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to CouchDB
const couchdbUrl = 'http://admin:admin@couchdb1:5984'; // Update with your CouchDB URL
const couchdb = nano(couchdbUrl);

// Use a specific database (create if it doesn't exist)
const dbName = 'messages'; // Replace with your desired database name
const db = couchdb.use(dbName);

function createDatabaseAndDesignDocument() {
  couchdb.db.create(dbName, (err) => {
    if (err && err.statusCode !== 412) { // Ignore "file_exists" error (status code 412)
      console.error('Error creating database:', err);
      return;
    }

    console.log('Database created');

    // Design document for the posts view
    const designDocument = {
      _id: '_design/posts',
      views: {
        all: {
          map: function (doc) {
            if (doc.type === 'post') {
              emit(doc._id, { topic: doc.topic, data: doc.data });
            }
          },
        },
      },
    };

    // Save design document
    db.insert(designDocument, (err) => {
      if (err) {
        console.error('Error creating design document:', err);
        return;
      }

      console.log('Design document created');
    });
  });
}

// Initialize CouchDB database and design document
createDatabaseAndDesignDocument();

app.post('/addPost', (req, res) => {
  var topic = req.body.topic;
  var data = req.body.data;

  // Save post document to CouchDB
  const postDocument = {
    type: 'post',
    topic: topic,
    data: data,
  };

  db.insert(postDocument, (err, body) => {
    if (err) {
      console.log('Could not add post to db');
      return res.status(500).json({ error: 'Could not add post to db' });
    }

    res.json({ topic: topic, data: data, id: body.id });
  });
});

app.get('/getPosts', (req, res) => {
  // Retrieve all posts from CouchDB
  db.view('posts', 'all', (err, body) => {
    if (err) {
      return res.status(500).json({ error: 'Error getting posts' });
    }

    const posts = body.rows.map(row => row.value);
    res.send(posts);
  });
});

app.listen(PORT, HOST);
console.log('Node server is up and running');
