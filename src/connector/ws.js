
// https://github.com/websockets/ws
syncio.ws = function ( options, on ) {

    if (typeof options.httpServer != 'undefined')
        options.server = options.httpServer;

    else if (typeof options.port != 'number')
        options.port = syncio.port;


    var socket_server = new syncio.ws.api.Server( options );

    socket_server.on('connection', function( user ){

        user.on('message', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        on.open( user );

    });


    return socket_server;

};

syncio.ws.api = require('ws');
syncio.ws.name_connector = 'ws';



/*

Url-Server: prefix cant be setted
Url-Client: ws://localhost:4444

*/



