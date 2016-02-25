
// https://github.com/sockjs/sockjs-node
dop.SockJS = function ( options, on ) {

    if (typeof options.httpServer == 'undefined')
        throw Error('The connector SockJS needs the parameter httpServer passed in the options');

    options.prefix = options.namespace;

    var socket_server = dop.SockJS.api.createServer( options );

    socket_server.on('connection', function(user) {

        user.on('data', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        user.send = dop.SockJS.send;

        on.open( user );

    });

    socket_server.installHandlers( options.httpServer, options );

    return socket_server;

};

dop.SockJS.api = require('sockjs');
dop.SockJS.name_connector = 'SockJS';

dop.SockJS.send = function( data ) {
    this.write( data );
};



/*

Url-Server: /dop
Url-Client: /dop

Url-Server: /dop
Url-Client: http://localhost:9999/dop

*/


