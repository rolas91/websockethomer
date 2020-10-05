const {io} = require('../index');
let  users = []; 
io.on('connection', client => {
    client.on('adduser', (user) => { 
        io.user = user; 
        users[user] = user; 
        console.log("que esto",users); 
    }); 
    
    client.on('disconnect', () => { 
        console.log('User: ' + users[io.user] + ' has disconnected');
        delete users[io.user]; 
        console.log(users) 
    });

    client.on('update', () => {
        users[user] = user; 
        console.log('Current users: ', users.id); 
    }); 
    
    // client.on('mensaje', (payload) => {
    //     console.log(payload);

    //     io.emit('mensaje', {admin:'Nuevo mensaje'})
    // })
});