// https://github.com/websockets/ws
dop.transport.listen.WebSocket = function WebSocket( listener, options, dop ) {

    if (typeof options.namespace != 'string')
        options.namespace = '/' + dop.name;

    if (typeof options.httpServer != 'undefined')
        options.server = options.httpServer;

    else if (typeof options.port != 'number')
        options.port = 4444;

    var transport = new dop.transport.listen.WebSocket.api.Server( options );

    transport.on('connection', function(socket){

        dop.core.onopen( listener, socket, dop.transport.listen.WebSocket );

        socket.on('message', function(message) {
            dop.core.onmessage( listener, socket, message );
        });

        socket.on('close', function() {
            dop.core.onclose( listener, socket );
        });

    });

    return transport;

};
dop.transport.listen.WebSocket.api = require('ws');


/*

Url-Server: prefix cant be setted
Url-Client: ws://localhost:4444

*/



