const { io } = require("../../index");
const homerProvider = require("../controllers/homerProvider");
var Request = require("request");
const activeUsers = [];

// function countDown( minutes, seconds )
// {
//     var element, endTime, hours, mins, msLeft, time;

//     function twoDigits( n )
//     {
//         return (n <= 9 ? "0" + n : n);
//     }

//     function updateTimer()
//     {
//         msLeft = endTime - (+new Date);
//         if ( msLeft < 1000 ) {
//             console.log("Time is up!");
//         } else {
//             time = new Date( msLeft );
//             hours = time.getUTCHours();
//             mins = time.getUTCMinutes();
//             console.log(( hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds()));
//             io.to(`${data.id}`).emit('getCountDown', { count : ( hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds())});
//             setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
//         }
//     }
//     endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
//     updateTimer();
// }

function sendNotification(data) {
  Request.post(
    {
      headers: { "content-type": "application/json" },
      url: "https://onesignal.com/api/v1/notifications",
      body: JSON.stringify({
        app_id: "8ad1c280-92da-4d39-b49c-cf0a81e0d1fc",
        include_player_ids: [`${data.onesignalid}`],
        data: { foo: "bar" },
        headings: { en: `${data.title}` },
        contents: { en: `${data.content}` },
      }),
    },
    (error, response, body) => {
      if (error) {
        return console.dir(error);
      }
      console.dir(JSON.parse(body));
    }
  );
}

io.on("connection", (socket) => {
  console.log("usuario conectado");
  let userName = "";
  socket.on("adduser", async (data) => {
    socket.userId = data.id;
    let response = await homerProvider.searchProvider(data.id);
    if (response == null) {
      homerProvider.addProvider(data).then((result) => {
        io.emit("adduser", result);
      });
    } else {
      let values = Object.values(response);
      homerProvider.updateProvider(values[0].id, !values[0].state);
    }

    // if(!activeUsers.includes(socket.userId)){
    // activeUsers.push(socket.userId);
    // console.log('usuario activo');
    // console.log('user add',activeUsers);
    // }
  });

  // socket.on('getCountDown', (data) => {
  //         var  endTime, hours, mins, msLeft, time;
  //         setTimeout(() =>{
  //             homerProvider.getOrderByProvider(data.id).then(result => {
  //                 if( result.length > 0){
  //                     for(let i = 0; i < result.length; i++){
  //                         // socket.join(`${result[i].id}`)
  //                         socket.join(`${data.id}`)
  //                         console.log("ver que pasa",result[i].isCount == 0 && result[i].isCountNow == 1);
  //                         console.log("ver que pasa2",result[i].isCount, result[i].isCountNow);
  //                         if(result[i].isCount == 0 && result[i].isCountNow == 1) {
  //                             console.log("entro o no");
  //                             homerProvider.updateStateOrderCount(result[i].id)
  //                             function twoDigits( n )
  //                             {
  //                                 return (n <= 9 ? "0" + n : n);
  //                             }

  //                             function updateTimer()
  //                             {
  //                                 msLeft = endTime - (+new Date);
  //                                 if ( msLeft < 1000 ) {
  //                                     homerProvider.updateOrder(result[i].id)
  //                                     sendNotification({
  //                                         "title":"Aviso",
  //                                         "content":"Se ha cancelado por que tu homer no acepto la solicitud",
  //                                         "onesignalid":result[i].onesignal
  //                                     })
  //                                     console.log("Time is up!");
  //                                 } else {
  //                                     time = new Date( msLeft );
  //                                     hours = time.getUTCHours();
  //                                     mins = time.getUTCMinutes();
  //                                     console.log(data.id,( hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds()));

  //                                     io.to(`${data.id}`).emit('getCountDown', {order:result[i].id, count : ( hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds())});
  //                                     setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
  //                                 }
  //                             }
  //                             endTime = (+new Date) + 1000 * (60*10 + 0) + 500;
  //                             updateTimer();
  //                         }
  //                     }
  //                 }
  //             });
  //     },1000)
  // });

  socket.on("getordersbyproviders", (data) => {
    let mytimer;
    let results = [];
    socket.userId = data.id;
    socket.join(`${data.id}`);
    setTimeout(() => {
      homerProvider.getOrderByProvider(socket.userId).then((result) => {
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            // if(result[i].isCount == 0 && result[i].isCountNow == 1) {
            function twoDigits(n) {
              return n <= 9 ? "0" + n : n;
            }

            function updateTimer() {
              msLeft = endTime - +new Date();
              if (msLeft < 1000) {
                console.log("Time is up!");
              } else {
                time = new Date(msLeft);
                hours = time.getUTCHours();
                mins = time.getUTCMinutes();

                mytimer =
                  (hours ? hours + ":" + twoDigits(mins) : mins) +
                  ":" +
                  twoDigits(time.getUTCSeconds()),
                  // console.log(data.id,( hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds()));

                  setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
              }
            }
            endTime = +new Date() + 1000 * (60 * 10 + 0) + 500;
            updateTimer();
            results.push({
              providerId: result[i].providerId,
              id: result[i].id,
              clientUi: result[i].clientUi,
              nameClient: result[i].nameClient,
              productUi: result[i].productUi,
              productName: result[i].productName,
              status: result[i].status,
              isCancel: result[i].isCancel,
              isCount: result[i].isCount,
              isCountNow: result[i].isCountNow,
              date: result[i].date,
              hour: result[i].hour,
              location: result[i].location,
              lat: result[i].lat,
              lng: result[i].lng,
              onesignal: result[i].onesignal,
              count: mytimer,
            });
            // io.to(`${data.id}`).emit("getordersbyproviders", results);
            // }
          }
        }
        io.to(`${data.id}`).emit('getordersbyproviders',results)
      });
    }, 1000);
  });

  socket.on("getordersbyclients", (data) => {
    socket.userId = data.id;
    console.log(socket.userId);
    socket.join(`${data.id}`);
    setInterval(() => {
      homerProvider.getOrderByClient(socket.userId).then((result) => {
        io.to(`${data.id}`).emit("getordersbyclients", result);
      });
    }, 2000);
  });

  socket.on("validaactiveprovider", (data) => {
    let dataEntry = data;
    let sendNewData = [];
    for (let i = 0; i < dataEntry.length; i++) {
      for (let j = 0; j < activeUsers.length; j++) {
        if (activeUsers[j] == dataEntry[i]) {
          sendNewData.push(activeUsers[j]);
        }
      }
    }

    io.emit("validaactiveprovider", [sendNewData]);
  });

  socket.on("set-nickname", (data) => {
    const room_data = data;
    userName = room_data.userName;
    const roomName = room_data.roomName;

    socket.join(`${roomName}`);
    console.log(`Username : ${userName} joined Room Name : ${roomName}`);

    io.to(`${roomName}`).emit("users-changed", {
      user: userName,
      event: "joined",
    });
  });

  socket.on("add-message", (data) => {
    const messageData = data;
    const messageContent = messageData.text;
    const roomName = messageData.roomName;

    console.log(`[Room Number ${roomName}] ${userName} : ${messageContent}`);
    homerProvider.addMessage(messageContent, userName, roomName, Date());
    io.to(`${roomName}`).emit("message", {
      text: messageContent,
      from: userName,
      created: new Date(),
    });
  });

  socket.on("unsubscribe", function (data) {
    console.log("unsubscribe trigged");
    const room_data = JSON.parse(data);
    const userName = room_data.userName;
    const roomName = room_data.roomName;

    console.log(`Username : ${userName} leaved Room Name : ${roomName}`);
    socket.broadcast.to(`${roomName}`).emit("userLeftChatRoom", userName);
    socket.leave(`${roomName}`);
  });

  socket.on("disconnect", () => {
    io.emit("user disconnected", socket.userId);
    io.emit("users-changed", { user: userName, event: "left" });
  });
});
