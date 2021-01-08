const {io} = require('../../index');
const homerProvider = require('../controllers/homerProvider');

const activeUsers = [];
io.on('connection', socket => {
   console.log('usuario conectado')
    socket.on('adduser', (data) => {
        socket.userId = data.id;
        console.log(socket.userId);
        // console.log('data',data);
        // console.log('socket id', socket.userId);
        homerProvider.searchProvider(data.id)
            .then(result => {
                if(result.length == 0){
                    homerProvider.addProvider(data).then(result => {
                        console.log(result);
                        io.emit('adduser',result);
                    });
                    
                }
            });

        // if(!activeUsers.includes(socket.userId)){
            // activeUsers.push(socket.userId);
            // console.log('usuario activo');
            // console.log('user add',activeUsers);
        // }
    }); 

    socket.on('getordersbyproviders', (data) => { 
        socket.userId = data.id;
        console.log(socket.userId);
  
        setInterval(() => {
            homerProvider.getOrderByProvider(socket.userId).then(result => {
                console.log(result);
                io.emit('getordersbyproviders',result)
            });
        },2000);
    });

    socket.on('getordersbyclients', (data) => { 
        socket.userId = data.id;
        console.log(socket.userId);
    
        setInterval(() => {
            homerProvider.getOrderByClient(socket.userId).then(result => {
                console.log(result);
                io.emit('getordersbyclients',result)
            });
        },2000);
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
    
    
    socket.on('chat:message', (data) => {
        io.sockets.emit('chat:message', data)
    });
    
    socket.on('chat:typing', (data) => {
        socket.broadcast.emit('chat:typing',data);
    });
    
    socket.on('disconnect', () => { 
        homerProvider.deleteProvider(socket.userId).then(response => {
            io.emit("user disconnected", socket.userId);
        })
        // var i = activeUsers.indexOf( socket.userId );
 
        // if ( i !== -1 ) {
        //     activeUsers.splice( i, 1 );
        // }
        // activeUsers.delete(socket.userId);
        // console.log('usuario desconectado');
    });
});