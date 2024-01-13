# WebApp for Blogging/ Discussions 
Personal project built for CMPT 353 Full-Stack Dev course at Usask using React and Nodejs

## Getting started
To run this project, you will need Docker Desktop running as this app uses Node, MySQL, React Images from Docker

1. Clone this repo
2. Start Node server and database by going into the node-app folder and running
   `docker-compose up`
3. Start the React app by going into client/react-app and running `docker-compose up`
4. Start exploring the app on your local browser on `http://localhost:3000` once the React app is started

## Project overview
Overview:
This project is a web application that allows users to create channels and communicate with each other 
through messages and pictures. The application is built using React on the frontend with express and MySQL on the backend.

### Features implemented:
#### Part 1: 
- Design and implement database tables 
- Landing pages
- Create/View/Select Channels
- Posting new messages in channels and replying to old messages synchronously
- Can post pictures as part of messaging
#### Part 2:
- User authentication created, cannot use system without authentication
- Username diaplayed in possted messages
- Admin account can delete users, channels, messages (Accoutn user: admin, password: admin) but cannot delete its own account
#### Part 3:
- Viisualized Nested replies created
- Thumbs up/down counter created
#### Part 4:
- Search feature to answe the following questions created
    ○ content that contain specific strings e.g. list all content that contains the string “arrow function”.
    ○ content created by a specific user
    ○ User with the most/least posts
    ○ User with the highest/lowest ranking of messages/replies
#### Part 5:
- Classification of users (beginner, imtermediate, expert) based on the number of posts created
- Styling input messages with space and newline for better visual of code posting

### Database Design:
MYSQL is the database management system used for this project due to its reliability, performance and scalability. 
There are three tables of significance in the database, they are Users, Messages, and Channels. 

- The User table stores each user created in the system with the columns: user_id,username,hashed_password, name, role, num_posts
- The Messages table stores all the messages which includes replies and images. The columns are: message_id,user,content, time,image_path,channel_id,parent_id,likes,dislikes
- The Channels table stores all channels created with columns: channel_id, user,name, description
- Foreign key constraints were used to connect each message 

### Backend Design:
- Backend was built using Node.js and Express. 
- RESTful APIs to handle user registration and authentication, channel creation, and message sending. 
- JWT-based authentication to protect the APIs and ensure that only authenticated users can create channels and send messages.

### Frontend Design:
- Frontend was built using React and styled it with CSS. 
- React-router-dom to handle routing and navigation between different pages. 
- I implemented context API (AuthProvider) to manage the user authentication state across the components
- Recusrsive displaying of messages is implemented for nested replies
- I used Axios and FetchAPI to interact with the backend APIs and handle HTTP requests and responses

### Conclusion:
- My architecture combines MySQL, Node.js, Express, and React for a reliable, scalable, and secure web application. 
- It ensures data integrity, user authentication, and easy deployment.
