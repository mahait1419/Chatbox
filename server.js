var express = require('express');
var app = express();
var server = require('http').createServer(app);

var IO = require("socket.io")(server);

users = [];
connection= [];

server.listen(process.env.PORT || 9090)
console.log("oooh Server Running..");

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

IO.sockets.on('connection',function(socket){
    connection.push(socket);
    console.log('Connected: %s sockets connected' , connection.length);

    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connection.splice(connection.indexOf(socket),1);
        console.log('Disconnected: %s socket connected ', connection.length);
    });

    socket.on('send message', function (data) {
        console.log(data);
        // IO.sockets.emit('new message', { msg: data, users: socket.username });
        IO.sockets.emit('new message', { users: socket.username, msg: data });
    });

    socket.on('new user', function(data,callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames(){
        IO.sockets.emit('get users', users);
    }
});
