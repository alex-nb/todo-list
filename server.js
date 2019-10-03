const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/mongo-db');
const todoListRouter = require('./routes/todo-list');
const cors = require('cors');

const app = express();

app.use(cors());

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/todo', todoListRouter);

app.use((req, res, next) => {
  res.status(404).json({ errors: [{ msg: 'Route not found.' }] });
});

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  });

const server = app.listen(8080);
const io = require('./socket').init(server);

io.on('connection', socket => {
  console.log('Client connected');
});