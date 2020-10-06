const {io} = require('../index');
const activeUsers = new Set();
io.on('connection', socket => {
   
    socket.on('adduser', (data) => {
        socket.userId = data;
        activeUsers.add(data)
        io.emit('adduser',[...activeUsers]);
    }); 
    
    socket.on('disconnect', () => { 
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
    });

   
    
    // client.on('mensaje', (payload) => {
    //     console.log(payload);

    //     io.emit('mensaje', {admin:'Nuevo mensaje'})
    // })
});