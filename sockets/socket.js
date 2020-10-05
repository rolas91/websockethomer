const {io} = require('../index');
let  users = []; 
io.on('connection', client => {
    socket.on('adduser', function (user) { 
        socket.user = user; 
        users[user] = user; 
        console.log(users); 
    }); 
    
    socket.on('disconnect', function () { 
        console.log('User: ' + users[socket.user] + ' has disconnected');
        delete users[socket.user]; console.log(users) 
    });

    socket.on('update', function () {
        users[user] = user; 
        console.log('Current users: ', users); 
    }); 
    
    // client.on('mensaje', (payload) => {
    //     console.log(payload);

    //     io.emit('mensaje', {admin:'Nuevo mensaje'})
    // })
});