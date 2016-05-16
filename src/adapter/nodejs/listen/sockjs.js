
// https://github.com/sockjs/sockjs-node
dop.adapter.nodejs.listen.SockJS = function ( options, on ) {

    if (typeof options.httpServer == 'undefined')
        throw Error('The connector SockJS needs the parameter httpServer passed in the options');

    options.prefix = options.namespace;

    var socket = dop.adapter.nodejs.listen.SockJS.api.createServer( options );

    socket.on('connection', function(user) {

        user.on('data', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        user.send = dop.adapter.nodejs.listen.SockJS.send;

        on.open( user );

    });

    socket.installHandlers( options.httpServer, options );

    return socket;

};

dop.adapter.nodejs.listen.SockJS.api = require('sockjs');
dop.adapter.nodejs.listen.SockJS._name = 'SockJS';

dop.adapter.nodejs.listen.SockJS.send = function( data ) {
    this.write( data );
};



/*

Url-Server: /dop
Url-Client: /dop

Url-Server: /dop
Url-Client: http://localhost:9999/dop

*/


