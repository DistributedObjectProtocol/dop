// https://github.com/websockets/ws
dop.adapter.nodejs.listen.WebSocket = function( listener, options ) {

    if (typeof options.httpServer != 'undefined')
        options.server = options.httpServer;

    else if (typeof options.port != 'number')
        options.port = 4444;

    var adapter = new dop.adapter.nodejs.listen.WebSocket.api.Server( options );

    adapter.on('connection', function( socket ){

        socket.remoteAddress = function() {
            return socket.upgradeReq.connection.remoteAddress;
        };

        dop.core.onopen( listener, socket, dop.adapter.nodejs.listen.WebSocket._name );

        socket.on('message', function(message) {
            dop.core.onmessage( listener, socket, message );
        });

        socket.on('close', function() {
            dop.core.onclose( listener, socket );
        });

    });

    return adapter;

};
dop.adapter.nodejs.listen.WebSocket.api = require('ws');
dop.adapter.nodejs.listen.WebSocket._name = 'WebSocket';



/*

Url-Server: prefix cant be setted
Url-Client: ws://localhost:4444

*/



