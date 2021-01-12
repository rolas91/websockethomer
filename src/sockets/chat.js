const {io} = require('../../index');
socket.on('disconnect', function(){
  io.emit('users-changed', {user: socket.nickname, event: 'left'});   
});

socket.on('set-nickname', (nickname) => {
  socket.nickname = nickname;
  io.emit('users-changed', {user: nickname, event: 'joined'});    
});

socket.on('add-message', (message) => {
  console.log(message);
  io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
});