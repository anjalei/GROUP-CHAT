const express = require('express');
const http = require('http');
const path = require('path');
const app = express();


app.use(express.static(path.join(__dirname, 'public')));


const port = 3000;
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on ${port}, sequelize connected`);
  });
});