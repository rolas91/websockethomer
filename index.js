const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cors());
app.use(express.static(path.join(__dirname,'/public')));

app.post('/validaactiveprovider', function (req, res) {
    let dataEntry = req.body;
    let providers = [1,2,3,4,6,7,8,9,10];
    let sendNewData = [];
    for(let i = 0; i < dataEntry.length; i++){
        for(let j = 0; j < providers.length; j++){
            if(providers[j] == dataEntry[i]){
                sendNewData.push(providers[j]);
            }
        }
    }
    res.status(200).json({sendNewData});
})

const server = app.listen(port, () => {
    console.log(`connection is successful on port  ${port}`)
});

module.exports.io = require('socket.io')(server);
require('./src/sockets/socket');