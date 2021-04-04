'use Strict';

const express = require('express');
require('dotenv').config();

const userRouter = require('./routes/userRouter');
const neaRouter = require('./routes/neaRouter');
const clientRouter = require('./routes/clientRouter');
const { login, logout, authUser } = require('./controllers/userController');

const server = express();

const HTTP = {
  port: process.env.HTTP_API_PORT || 8081,
  host: process.env.HTTP_API_HOST || '127.0.0.1',
};

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// test endpoint
server.get('/', (req, res) => {
  res.send("Hello World! I'm a API server");
});

//server.use('/user', authUser);
server.use('/user', userRouter);

//server.use('/user', authUser);
server.use('/nea', neaRouter);

server.use('/client', clientRouter);

server.post('/login', login);

server.post('/logout', logout);

server.listen(HTTP.port, HTTP.host, () => {
  // eslint-disable-next-line no-console
  console.log(`API server running at http://${HTTP.host}:${HTTP.port}`);
});
