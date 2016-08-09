// https://github.com/websockets/ws
dop.transport.nodejs.listen.WebSocket = function( listener, options ) {

    if (typeof options.httpServer != 'undefined')
        options.server = options.httpServer;

    else if (typeof options.port != 'number')
        options.port = 4444;

    var transport = new dop.transport.nodejs.listen.WebSocket.api.Server( options );

    transport.on('connection', function( socket ){

        socket.remoteAddress = function() {
            return socket.upgradeReq.connection.remoteAddress;
        };

        dop.core.onopen( listener, socket, dop.transport.nodejs.listen.WebSocket._name );

        socket.on('message', function(message) {
            dop.core.onmessage( listener, socket, message );
        });

        socket.on('close', function() {
            dop.core.onclose( listener, socket );
        });

    });

    return transport;

};
dop.transport.nodejs.listen.WebSocket.api = require('ws');
dop.transport.nodejs.listen.WebSocket._name = 'WebSocket';



/*

Url-Server: prefix cant be setted
Url-Client: ws://localhost:4444

*/



