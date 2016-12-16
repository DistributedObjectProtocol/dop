var socketioServer = require('socket.io');



server = new socketioServer();
server.listen(12345);

server
.of('dopi')
.on('connection', function(socket) {
    socketClient = socket;
    console.log( 'connection' );
    socket.on('message', function(message){
        console.log( '❌ message', message );
    });
    socket.on('disconnect', function(){
        console.log( '❌ disconnect' );
    });
});


/////////////////








var socketioClient = require('socket.io-client');





client = new socketioClient('ws://127.0.0.1:12345/dopi');


var msg=0;
function send() {
    client.send(String(msg));
    if (msg++ < 120)
        setTimeout(send, 500);
}
send();


setTimeout(function(){
    // socketClient.disconnect();
}, 1000);