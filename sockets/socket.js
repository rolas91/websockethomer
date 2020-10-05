const {io} = require('../index');

io.on('connection', client => {
    console.log('cliente conectado', client.id);

    client.on('disconnect', () => {
        console.log('Cliente desconectado')
    });
    
    client.on('mensaje', (payload) => {
        console.log(payload);

        io.emit('mensaje', {admin:'Nuevo mensaje'})
    })
});