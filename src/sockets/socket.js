const {io} = require('../../index');

const activeUsers = new Set();
io.on('connection', socket => {
   console.log('usuario conectado')
    socket.on('adduser', (data) => {
        socket.userId = data;
        let actives = activeUsers.reduce((acc,item)=>{
            if(!acc.include(item)){
                activeUsers.add(data)
            }
            return acc;
        },[]);
        io.emit('adduser',[...actives]);
        console.log('usuario activo');
        console.log('user add',actives);
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
        
        io.emit('validaactiveprovider',[...sendNewData]);
       
        console.log('user validated',sendNewData);
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
    
});