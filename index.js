const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.static(path.join(__dirname,'/public')));


const server = app.listen(port, () => {
    console.log(`connection is successful on port  ${port}`)
});

module.exports.io = require('socket.io')(server);
require('./sockets/socket');