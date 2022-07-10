const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const path = require('path');

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/draw', (req, res) => {
	res.sendFile(__dirname + '/public/draw.html');
});

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('createOrJoin', (info) => {
		console.log('createOrJoin');
		const myRoom = io.sockets.adapter.rooms.get(info.roomId) || { length: 0 };
        console.log(myRoom);
		if (myRoom.length === 0) {
			socket.join(info.roomId);
			socket.emit('roomCreated', info);
			console.log('roomCreated');
		} else {
			socket.join(info.roomId);
			socket.emit('roomJoined', info);
			console.log('roomJoined');
		}
		console.log(info, io.sockets.adapter.rooms);
	});
    socket.on('draw', (data) => {
        socket.broadcast.to(data.roomId).emit('draw', data);
    })
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

server.listen(3000, () => {
	console.log('listening on *:3000');
});
