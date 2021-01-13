const {io} = require('../../index');
const homerProvider = require('../controllers/homerProvider');

const activeUsers = [];
io.on('connection', socket => {
    console.log("usuario conectado")
    let userName = '';
    socket.on('adduser', (data) => {
        socket.userId = data.id;
        homerProvider.searchProvider(data.id)
            .then(result => {
                if(result.length == 0){
                    homerProvider.addProvider(data).then(result => {
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
        setInterval(() => {
            homerProvider.getOrderByProvider(socket.userId).then(result => {
                io.emit('getordersbyproviders',result)
            });
        },2000);
    });

    socket.on('getordersbyclients', (data) => { 
        socket.userId = data.id;
        socket.join(`${data.id}`)
        setInterval(() => {
            homerProvider.getOrderByClient(socket.userId).then(result => {
                io.to(`${data.id}`).emit('getordersbyclients',result)
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
    }); 
    
    
    
    socket.on('set-nickname', (data) => {   
        const room_data = data;
        userName = room_data.userName;
        const roomName = room_data.roomName;

        socket.join(`${roomName}`)
        console.log(`Username : ${userName} joined Room Name : ${roomName}`)

        io.to(`${roomName}`).emit('users-changed', {user: userName, event: 'joined'});    
    });

    socket.on('add-message', (data) => {
        const messageData = data;
        const messageContent = messageData.text
        const roomName = messageData.roomName
        
         console.log(`[Room Number ${roomName}] ${userName} : ${messageContent}`)

        io.to(`${roomName}`).emit('message', {text: messageContent, from:userName, created: new Date()})   
    });   
    

    socket.on('unsubscribe',function(data) {
        console.log('unsubscribe trigged')
        const room_data = JSON.parse(data)
        const userName = room_data.userName;
        const roomName = room_data.roomName;
    
        console.log(`Username : ${userName} leaved Room Name : ${roomName}`)
        socket.broadcast.to(`${roomName}`).emit('userLeftChatRoom',userName)
        socket.leave(`${roomName}`)
    })

    

    socket.on('disconnect', () => { 
        // homerProvider.deleteProvider(socket.userId).then(response => {
                      
        // })
        io.emit("user disconnected", socket.userId);
        io.emit('users-changed', {user: userName, event: 'left'});
    });
    
});