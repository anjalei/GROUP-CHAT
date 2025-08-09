const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');

const sequelize = require('./util/database');

const signUpRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const messageRoutes = require('./routes/message');

const User = require('./model/user');
const Message = require('./model/message');

app.use(cors({
  origin: 'http://127.0.0.1:5500', 
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api',signUpRoutes);
app.use('/api',loginRoutes);
app.use('/api',messageRoutes);

User.hasMany(Message);
Message.belongsTo(User);



const port = 3000;
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on ${port}, sequelize connected`);
  });
});