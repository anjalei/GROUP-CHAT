 const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');
const cron = require("node-cron");
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server, { 
  cors : { origin : '*' }
});
module.exports = { io };
const sequelize = require('./util/database');

const startArchiver = require("./jobs/archiever");


io.on("connection", (socket) => {
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
  });
});



const signUpRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');
 

const User = require('./model/user');
const Message = require('./model/message');
const Group = require('./model/group');
const GroupMember = require('./model/groupmember');
const ArchivedChat = require('./model/archievedChat');

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST','DELETE','PATCH'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api',signUpRoutes);
app.use('/api',loginRoutes);
app.use('/api',messageRoutes);
app.use('/group',groupRoutes);


User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

Group.belongsToMany(User,{through:GroupMember,as: "members" });
User.belongsToMany(Group,{through:GroupMember, as: "groups"})


const port = 3000;
sequelize
.sync()
  .then(() => {
    server.listen(port, () => {
      console.log(`🚀 Server running on ${port}, sequelize connected`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to connect to DB:", err);
  });
