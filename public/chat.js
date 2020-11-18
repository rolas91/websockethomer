let message = document.getElementById('message');
let username = document.getElementById('username');
let button = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');
let div = document.createElement("div");
let li ;
let p ;
let providers = [];
const socket = io();
socket.on('connect', function(){
    console.log('Conectado al servidor');
});

socket.on('disconnect', function(){
    console.log('Desconectado del servidor');
});

socket.on('adduser', function(data){
   
    for(let i = 0; i < data.length; i++){
        li = document.createElement("li");
        p = document.createElement("p")

        p.innerHTML = data[i];
        p.id = data[i];
        document.querySelector("#homeronline").appendChild(li).appendChild(p);
    } 
});

socket.on('validaactiveprovider', function(data){
    providers.push(data)
    for(let provider of providers){
        div.innerHTML = provider;        
    }
    document.querySelector("#activos").appendChild(li)
});

socket.on('user disconnected', function(data){
    document.getElementById(`${data}`).remove();
});

socket.emit('mensaje', {nombre:'Rolando'});

socket.on('mensaje', function(payload){
    console.log('Escuchando', payload)
});

button.addEventListener('click', function(){
    socket.emit('chat:message',{
        message: message.value,
        username:username.value
    });
});


message.addEventListener('keypress', function(){
    socket.emit('chat:typing', username.value)
});
socket.on('chat:message', function(data){
    actions.innerHTML = '';
    output.innerHTML += `<p>
        <strong>${data.username}</strong>: ${data.message}
    </p>`
});

socket.on('chat:typing', function(data){
    actions.innerHTML = `<p>
        <em>${data} is typing a message.</em>
    </p>`
});