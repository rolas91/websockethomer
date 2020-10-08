const {io} = require('../index');
const activeUsers = new Set();
io.on('connection', socket => {
   console.log('usuario conectado')
    socket.on('adduser', (data) => {
        socket.userId = data;
        activeUsers.add(data)
        io.emit('adduser',[...activeUsers]);
        console.log('usuario activo');
    }); 
    
    socket.on('disconnect', () => { 
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
        console.log('usuario desconectado');
    });

    socket.on('chat:message', (data) => {
        io.sockets.emit('chat:message', data)
    });

    socket.on('chat:typing', (data) => {
        socket.broadcast.emit('chat:typing',data);
    });
    
    client.on('mensaje', (payload) => {
        console.log(payload);

        io.emit('mensaje', {admin:'Nuevo mensaje'})
    })
});