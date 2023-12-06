'use strict';


const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');
var jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const { error } = require('console');
const saltRounds = 10;

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
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    // Set the filename to be unique and avoid collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 4);
    // Use file.originalname to get the file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    // Adjust the extension as needed
  },
});

const upload = multer({ storage: storage });

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
        likes INT DEFAULT 0,
        dislikes INT DEFAULT 0,
        FOREIGN KEY (channel_id) REFERENCES Channels(channel_id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES Messages(message_id) ON DELETE CASCADE
      )`,
      (err) => {
        if (err) {
          console.error('Error creating Messages table:', err);
        } else {
          console.log('Created table: Messages');
          createUserstable();
        }
      }
    );
  }
  /**
   * Creating Users table
   */
  function createUserstable(){
    const query = `CREATE TABLE IF NOT EXISTS Users (
      user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) DEFAULT NULL,
      hashed_password VARCHAR(255) DEFAULT NULL,
      name VARCHAR(255) DEFAULT NULL,
      num_posts INT DEFAULT 0,
      role INT NULL,
      INDEX idx_username (username)
    );`
    connection.query(query,(err)=>{
      if(err){
        console.error("Error creating Users table:",err);
      }
      else{
        console.log('Created table: Users');
      }
    }
    );
  };


  // Endpoint to initialize the database
// app.post('/initializeDb', (req, res) => {
//   createDatabaseAndTable();
//   res.json({ message: 'Database initialization started' });
// });
createDatabaseAndTable();
console.log('Database initialization started');

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


app.post('/postMessage', upload.single('image'), (req, res) => {
  console.log('Received Message request body:', req.body);

  const user = req.body.user;
  const channel_id = req.body.channel_id;
  const parent_id = req.body.parent_id === null ? null : req.body.parent_id;
  const message_content = req.body.content;
  const time = new Date().toLocaleString();
  const image_path = req.file ? req.file.filename : null;

  const query = `INSERT INTO Messages (user, content, time, image_path, channel_id, parent_id) VALUES ('${user}', '${message_content}', '${time}', '${image_path}', ${channel_id}, ${parent_id})`;

  connection.query(query, (err, results) => {
      if (err) {
          console.error('Could not add message to db:', err);
          return res.status(500).json({ error: 'Could not add message to db' });
      }

      const insertedMessageId = results.insertId; // Get the ID of the inserted message

      console.log('Message added to the database');
      addUserPosts(user);
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

function addUserPosts(username){
  const user_query = `UPDATE Users SET num_posts = num_posts + 1 WHERE username = '${username}'`;
  connection.query(user_query,(error,results)=>{
    if(error){
      console.error("Could not add post numbers");
    }
    else{
      console.error("Added to posts number for user: ",username);
    }
  });

}



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
        const imageUrl = message.image_path ? `http://localhost:80/images/${message.image_path}` : null;
        return { ...message, imageUrl };
      });
  
      res.json(messagesWithImageUrls);
    });
  });

 
  app.post("/registerUser", (req, res) => {
    const { username, password, name, role } = req.body;
  
    // Check if the username already exists
    const checkQuery = `SELECT * FROM Users WHERE username = '${username}'`;
  
    connection.query(checkQuery, (checkErr, checkResults) => {
      if (checkErr) {
        console.error("Error checking username:", checkErr);
        res.status(500).send("Error checking username");
      } else {
        if (checkResults.length > 0) {
          // Username already exists, handle accordingly
          res.status(400).send("Username already taken. Please choose a different one.");
        } else {
          // Username is unique, proceed with registration
          bcrypt.hash(password, saltRounds, (hashErr, hash) => {
            if (hashErr) {
              console.error("Error hashing password: ", hashErr);
              res.status(500).send("Error hashing password");
            } else {
              const insertQuery = `INSERT INTO Users (username, hashed_password, name,role) VALUES ('${username}', '${hash}', '${name}',${role})`;
  
              connection.query(insertQuery, (insertErr, result) => {
                if (insertErr) {
                  console.error("Error inserting user into database: ", insertErr);
                  res.status(500).send("Error inserting user into database");
                } else {
                  console.log("User entered successfully");
                  const userId = result.insertId;
                  const userData = { user_id: userId, username, name };
                  res.status(200).json(userData);
                }
              });
            }
          });
        }
      }
    });
  });
  
  

app.post("/loginUser", (req, res) => {
  const { username, password } = req.body;

  // Query the database to check if the user with the given credentials exists
  // (Implement this part based on your database structure)
  const query = `SELECT * FROM Users WHERE username = ?`;
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error querying the database: ", err);
      res.status(500).send("Error querying the database");
    } else {
      // Check if the user exists and if the password matches
      if (results.length > 0) {
        const storedHashedPassword = results[0].hashed_password;

        // Compare the entered password with the stored hashed password
        bcrypt.compare(password, storedHashedPassword, (compareError, match) => {
          if (compareError) {
            console.error("Error comparing passwords: ", compareError);
            res.status(500).send("Error comparing passwords");
          } else {
            if (match) {
              // Passwords match, consider the user as authenticated
              const secretKey = "secretkey123"
              const userData = { user_id: results[0].user_id, username: results[0].username, name: results[0].name, role:results[0].role };
              const jwtToken = jwt.sign(
                userData,secretKey,
                {expiresIn: '1hr'}
              );
              res.status(200).json({role:results[0].role, token: jwtToken});
            } else {
              // Passwords do not match, authentication failed
              res.status(401).send("Invalid credentials");
            }
          }
        });
      } else {
        // No user found with the given username, authentication failed
        res.status(401).send("Invalid credentials");
      }
    }
  });
});



app.delete('/deleteMessage/:messageId', (req, res) => {
  const messageId = req.params.messageId;

  // Recursive function to delete a message and its replies
  function deleteMessageAndReplies(messageId, callback) {
    const query = `SELECT message_id FROM Messages WHERE parent_id = ${messageId}`;

    connection.query(query, (err, rows) => {
      if (err) {
        callback(err);
        return;
      }

      const childMessages = rows.map(row => row.message_id);

      // Delete the main message
      const deleteMainQuery = `DELETE FROM Messages WHERE message_id = ${messageId}`;

      connection.query(deleteMainQuery, (err) => {
        if (err) {
          callback(err);
          return;
        }

        // Delete replies one by one
        const deleteRepliesPromises = childMessages.map(childId => new Promise((resolve, reject) => {
          const deleteReplyQuery = `DELETE FROM Messages WHERE message_id = ${childId}`;
          connection.query(deleteReplyQuery, (err) => {
            if (err) reject(err);
            else resolve();
          });
        }));

        // Wait for all delete operations to finish
        Promise.all(deleteRepliesPromises)
          .then(() => callback())
          .catch(err => callback(err));
      });
    });
  }

  // Start the recursive delete operation
  deleteMessageAndReplies(messageId, (err) => {
    if (err) {
      console.error('Error deleting message and replies:', err);
      res.status(500).send('Error deleting message and replies');
    } else {
      console.log(`Message with ID ${messageId} and its replies deleted`);
      res.status(200).send('Message and replies deleted successfully');
    }
  });
});


app.delete('/deleteChannel/:channelId', (req, res) => {
  const channelId = req.params.channelId;

  const deleteChannelQuery = `DELETE FROM Channels WHERE channel_id = ${channelId}`;

  connection.query(deleteChannelQuery, (err) => {
    if (err) {
      console.error('Error deleting channel and related messages:', err);
      res.status(500).send('Error deleting channel and related messages');
    } else {
      console.log(`Channel with ID ${channelId} and its related messages deleted`);
      res.status(200).send('Channel and related messages deleted successfully');
    }
  });
});

app.delete('/deleteuser/:username', (req, res) => {
  const username = req.params.username;

  const deleteChannelQuery = `DELETE FROM Users WHERE username = '${username}'`;

  connection.query(deleteChannelQuery, (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Error deleting user');
    } else {
      console.log(`User with username ${username} deleted`);
      res.status(200).send('User deleted successfully');
    }
  });
});

app.get('/getUsers', (req, res) => {

  const query = "SELECT name, username,num_posts FROM Users";

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving users:', err);
      res.status(500).send('Error retrieving users');
    } else {
      // Extract only the Name and Username from the results
      const simplifiedUsers = results.map(user => ({ name: user.name, username: user.username, num_posts: user.num_posts }));

      console.log('Users retrieved successfully');
      res.status(200).json(simplifiedUsers);
    }
  });
});


app.put('/updateCounts/:message_id', async (req, res) => {
  const message_id = req.params.message_id;
  const {likes, dislikes} = req.body;
  console.log("like: ",likes," dislikes: ",dislikes);

  const query = `UPDATE Messages SET likes = ${likes}, dislikes = ${dislikes} WHERE message_id = ${message_id};`;
  connection.query(query,(err, result) => {
    if(err){
      console.log('Error updating db with likes and dislikes');
      res.status(500).send("Error updating db with likes and dislikes");
    }
    else{
      console.log('Updated likes and dislikes');
      res.status(200).send('Updated likes and dislikes');
    }
  });

});

//////////////// Search function /////////////////////////


app.get('/search/content', async (req, res) => {
  const { query } = req.query;
  console.log("Received request in content back");
  try {
    // Perform the search logic based on the query in the MySQL database
    const queryResult = await searchContentInDatabase(query);

    res.json(queryResult);
  } catch (error) {
    console.error('Error searching content in the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function searchContentInDatabase(query) {
  return new Promise((resolve, reject) => {
    // Adjust the SQL query based on your database schema
    const searchQuery = `
      SELECT * FROM Messages
      WHERE content LIKE '%${query}%'
    `;

    connection.query(searchQuery, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}


app.get('/search/user', async (req, res) => {
  const { query } = req.query;

  // Construct the SQL query to retrieve messages by the user
  const searchQuery = `
    SELECT * FROM Messages
    WHERE user = ?
  `;

  const queryString = `${query}`;

  // Execute the query
  connection.query(searchQuery, [queryString], (error, results, fields) => {
    if (error) {
      console.error('Error executing the query: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the results back to the client
    res.json(results);
  });
});

// Define a route to handle the request for the user with the most posts
app.get('/search/user/most-posts', async (req, res) => {
  // Construct the SQL query to retrieve the user with the most posts
  const searchQuery = `
    SELECT * FROM Users
    ORDER BY num_posts DESC
    LIMIT 1
  `;

  // Execute the query
  connection.query(searchQuery, (error, results, fields) => {
    if (error) {
      console.error('Error executing the query: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log("User found: ",results[0].username);
    // Send the result back to the client
    res.json(results); // Assuming there is only one user with the most posts
  });
});

// Define a route to handle the request for the user with the most posts
app.get('/search/user/least-posts', async (req, res) => {
  // Construct the SQL query to retrieve the user with the most posts
  const searchQuery = `
    SELECT * FROM Users
    ORDER BY num_posts
    LIMIT 1
  `;

  // Execute the query
  connection.query(searchQuery, (error, results, fields) => {
    if (error) {
      console.error('Error executing the query: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log("User found: ",results[0].username);
    // Send the result back to the client
    res.json(results); // Assuming there is only one user with the most posts
  });
});




app.use(express.static('public'));
  
app.listen(PORT, HOST);
console.log('Node server is up and running');
