const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');
const sequelize = require('./util/database');

const userRoutes = require('./routes/signup');

const User = require('./model/user');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', userRoutes);


const port = 3000;
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on ${port}, sequelize connected`);
  });
});