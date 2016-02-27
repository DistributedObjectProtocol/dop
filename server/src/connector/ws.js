
// https://github.com/websockets/ws
synko.ws = function ( options, on ) {

    if (typeof options.httpServer != 'undefined')
        options.server = options.httpServer;

    else if (typeof options.port != 'number')
        options.port = synko.port;


    var socket_server = new synko.ws.api.Server( options );

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

synko.ws.api = require('ws');
synko.ws.name_connector = 'ws';



/*

Url-Server: prefix cant be setted
Url-Client: ws://localhost:4444

*/



