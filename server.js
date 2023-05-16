const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Server';
//runs when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id,username,room);

        socket.join(user.room);

        //welcoming curr user
        socket.emit('message', formatMessage(botName, 'Welcome to Chatroom'));

        //broadcast when a user connects
        socket.broadcast.to(user.room)('message', formatMessage(botName, `${user.username} has joined the chat`));
    });

    //chat message listening
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    });

    //runs when clients dcs
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running on ${PORT}`));

