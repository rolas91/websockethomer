const {io} = require('../../index');
socket.on('disconnect', function(){
  io.emit('users-changed', {user: socket.nickname, event: 'left'});   
});

