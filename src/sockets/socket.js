const {io} = require('../../index');

const activeUsers = [];
io.on('connection', socket => {
   console.log('usuario conectado')
    socket.on('adduser', (data) => {
        socket.userId = data.id;
        console.log('data',data.id);
        console.log('socket id', socket.userId);
        if(!activeUsers.includes(socket.userId)){
            activeUsers.push(socket.userId);
            io.emit('adduser',activeUsers);
            console.log('usuario activo');
            console.log('user add',activeUsers);
        }
    }); 

    socket.on('validaactiveprovider', (data) => {
        let dataEntry = data;
        let sendNewData = [];
        for(let i = 0; i < dataEntry.length; i++){
            for(let j = 0; j < activeUsers.length; j++){
                if(activeUsers[j] == dataEntry[i]){
                    sendNewData.push(activeUsers[j]);
                }
            }
        }
        
        io.emit('validaactiveprovider',[sendNewData]);
       
        console.log('user validated',sendNewData);
    }); 
    
    socket.on('disconnect', () => { 
        var i = activeUsers.indexOf( socket.userId );
 
        if ( i !== -1 ) {
            activeUsers.splice( i, 1 );
        }
        // activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
        console.log('usuario desconectado');
    });

    socket.on('chat:message', (data) => {
        io.sockets.emit('chat:message', data)
    });

    socket.on('chat:typing', (data) => {
        socket.broadcast.emit('chat:typing',data);
    });
    
});