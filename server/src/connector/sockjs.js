
// https://github.com/sockjs/sockjs-node
synko.SockJS = function ( options, on ) {

    if (typeof options.httpServer == 'undefined')
        throw Error('The connector SockJS needs the parameter httpServer passed in the options');

    options.prefix = options.namespace;

    var socket_server = synko.SockJS.api.createServer( options );

    socket_server.on('connection', function(user) {

        user.on('data', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        user.send = synko.SockJS.send;

        on.open( user );

    });

    socket_server.installHandlers( options.httpServer, options );

    return socket_server;

};

synko.SockJS.api = require('sockjs');
synko.SockJS.name_connector = 'SockJS';

synko.SockJS.send = function( data ) {
    this.write( data );
};



/*

Url-Server: /synko
Url-Client: /synko

Url-Server: /synko
Url-Client: http://localhost:9999/synko

*/


