const path = require("path");
require("dotenv").config();
const express = require("express");
const sequelize = require("./src/db");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const haversine = require("haversine");
const cron = require("node-cron");
const { changeState } = require("./src/controllers/homerProvider");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors());
// app.use("/api-node-homer", express.static(path.join(__dirname, "/public")));

app.post("/validaactiveprovider", function (req, res) {
  let dataEntry = req.body;
  let providers = [1, 2, 3, 4, 6, 7, 8, 9, 10];
  let sendNewData = [];
  for (let i = 0; i < dataEntry.length; i++) {
    for (let j = 0; j < providers.length; j++) {
      if (providers[j] == dataEntry[i]) {
        sendNewData.push(providers[j]);
      }
    }
  }
  res.status(200).json({ sendNewData });
});

// app.post('/nearby', function(req, res){
//     res.status(200).json(haversine(start, end,{ unit: 'mile'}));
// });

const router = require("./src/routes");
app.use("/api/v1", router);

const server = app.listen(port, () => {
  sequelize
    .sync({ force: false })
    .then(() => {
      console.log("conexion exitosa a la base de datos");
    })
    .catch((error) => {
      console.log("Se ha producido un error", error);
    });
  cron.schedule("* * * * *", () => {
    changeState();
  });
  console.log(`connection is successful on port  ${port}`);
});

module.exports.io = require("socket.io")(server, {
  cors: {
    origins: ["http://localhost:8080"],
  },
});
require("./src/sockets/socket");
