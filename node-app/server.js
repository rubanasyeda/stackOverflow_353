'use strict';


const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 8080;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const connection = mysql.createConnection({
  host: 'mysql1',
  user: 'root',
  password: 'admin',
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Set the destination folder where uploaded images will be stored
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      // Set the filename to be unique and avoid collisions
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg'); // Adjust the extension as needed
    },
  });
  
  const upload = multer({ dest: 'uploads/' });

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
  
    console.log('Connected to MySQL');
    // fetch("/initializeDb")
  
  });
  
  function createDatabaseAndTable() {
    connection.query('CREATE DATABASE IF NOT EXISTS project353', (err) => {
      if (err) {
        console.error('Error creating database:', err);
        connection.end();
        return;
      }
  
      console.log('Database created');
  
      connection.query('USE project353', (err) => {
        if (err) {
          console.error('Error selecting database:', err);
          connection.end();
          return;
        }
  
        createChannelsTable();
      });
    });
  }
  
  function createChannelsTable() {
    connection.query(
      `CREATE TABLE IF NOT EXISTS Channels (
        channel_id INT AUTO_INCREMENT PRIMARY KEY,
        user VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        description TEXT
      )`,
      (err) => {
        if (err) {
          console.error('Error creating Channels table:', err);
          connection.end();
          return;
        }
        console.log('Created table: Channels');
        createMessagesTable();
      }
    );
  }
  
  function createMessagesTable() {
    connection.query(
      `CREATE TABLE IF NOT EXISTS Messages (
        message_id INT AUTO_INCREMENT PRIMARY KEY,
        user VARCHAR(255),
        content TEXT,
        time varchar(100) NOT NULL,
        image_path VARCHAR(255),
        channel_id INT NULL,
        parent_id INT NULL,
        FOREIGN KEY (channel_id) REFERENCES Channels(channel_id),
        FOREIGN KEY (parent_id) REFERENCES Messages(message_id)
      )`,
      (err) => {
        if (err) {
          console.error('Error creating Messages table:', err);
        } else {
          console.log('Created table: Messages');
        }
        // connection.end();
      }
    );
  }
  
    // Endpoint to initialize the database
  app.post('/initializeDb', (req, res) => {
    createDatabaseAndTable();
    res.json({ message: 'Database initialization started' });
  });
  

app.post('/createChannel', (req, res) => {
    console.log('Received request body:', req.body);
    const user = "user";
    const channelName = req.body.name;
    const channelDesc = req.body.desc;
  
    const query = `INSERT INTO Channels (user ,name, description) VALUES ('${user}','${channelName}','${channelDesc}')`;
    connection.query(query, (err) => {
      if (err) {
        console.error('Could not add channel to db:', err);
        return res.status(500).json({ error: 'Could not add channel to db' });
      }
      console.log('Channel created:', channelName);
  
      res.json({ name: channelName, desc: channelDesc });
    });
  });

app.get('/getChannels', (req, res) => {
  connection.query(`SELECT * FROM Channels`, function (err, results) {
    if (err) return res.status(500).json({ error: `Error getting channels: ${err}` });
    res.send(results);
  });
});

// app.post('/postMessage', upload.single('image'), (req, res) => {
//     console.log('Received Message request body:', req.body);
//     const user = "user";
//     const message_content = "req.body.content";
//     const image_path = req.file ? req.file.path : null;     // image path need more work
//     const channel_id = 1;
//     const parent_id = req.body.parent_id;
  
//     const query = `INSERT INTO Messages (user,content, image_path,channel_id,parent_id) VALUES ('${user}','${message_content}','${image_path}','${channel_id}','${parent_id}')`;
//     connection.query(query, (err) => {
//       if (err) {
//         console.error('Could not add channel to db:', err);
//         return res.status(500).json({ error: 'Could not add message to db' });
//       }
//       console.log('Channel created:', channelName);
  
//       res.json({ name: channelName, desc: channelDesc });
//     });
//   });

app.post('/postMessage', upload.single('image'), (req, res) => {
  console.log('Received Message request body:', req.body);

  const user = req.body.user;
  const channel_id = req.body.channel_id;
  const parent_id = req.body.parent_id === null ? null : req.body.parent_id;
  const message_content = req.body.content;
  const time = new Date().toLocaleString();
  const image_path = req.file ? req.file.path : null;

  const query = `INSERT INTO Messages (user, content, time, image_path, channel_id, parent_id) VALUES ('${user}', '${message_content}', '${time}', '${image_path}', ${channel_id}, ${parent_id})`;

  connection.query(query, (err, results) => {
      if (err) {
          console.error('Could not add message to db:', err);
          return res.status(500).json({ error: 'Could not add message to db' });
      }

      const insertedMessageId = results.insertId; // Get the ID of the inserted message

      console.log('Message added to the database');
      
      // Send back the inserted data in the response
      res.json({
          success: true,
          message: {
              message_id: insertedMessageId,
              user,
              content: message_content,
              time,
              image_path,
              channel_id,
              parent_id
          }
      });
  });
});


///////////////////////////////////////
app.get('/messagesByChannel', (req, res) => {
    const channel_id = req.query.channel_id;
  
    if (!channel_id) {
      return res.status(400).json({ error: 'Channel ID is required as a query parameter.' });
    }
  
    connection.query(`SELECT * FROM Messages WHERE channel_id = ${channel_id}`, (err, results) => {
      if (err) {
        return res.status(500).json({ error: `Error getting messages: ${err}` });
      }
  
      // Process each message to include the image URL if an image exists
      const messagesWithImageUrls = results.map(message => {
        const imageUrl = message.image_path ? `https://localhost:80/${message.image_path}` : null;
        return { ...message, imageUrl };
      });
  
      res.json(messagesWithImageUrls);
    });
  });

 
  
  
// app.use('/uploads', express.static('uploads'));

app.listen(PORT, HOST);
console.log('Node server is up and running');
