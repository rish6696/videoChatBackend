const express = require('express');
const app = express();
const PORT = 5896;
const http = require('http');
const socket = require('socket.io');


const server = http.createServer(app);

const io = socket(server);

const users = {};


app.use('/',(req,res)=>{
    res.send('hello');
})

io.on('connection', socket => {
    console.log('device connected with socket id',socket.id)
    if (!users[socket.id]) {
        users[socket.id] = socket.id;
    }
    socket.emit("yourID", socket.id);
    io.sockets.emit("allUsers", users);

    socket.on('disconnect', () => {
        delete users[socket.id];
        console.log("some disconnected with id ",socket.id);
        io.emit('allUsers',users)
    }) 

    socket.on("callUser",(data) => {
        console.log("recieved the request to call with data",data.callToUser)
        io.to(data.callToUser).emit('hey', {signal: data.signal, from: data.from});
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })
});


server.listen(PORT,()=>{
    console.log("server started on the port "+PORT);
})