
// https://github.com/sockjs/sockjs-node
syncio.SockJS = function ( options, on ) {

    if (typeof options.httpServer == 'undefined')
        throw Error('The connector SockJS needs the parameter httpServer passed in the options');

    options.prefix = options.namespace;

    var that = syncio.SockJS.api.createServer( options );

    that.on('connection', function(user) {

        user.on('data', function(message) {
            on.message( message, user );
        });

        user.on('close', function() {
            on.close( user );
        });

        user.send = syncio.SockJS.send;

        on.open( user );

    });

    that.installHandlers( options.httpServer, options );

    return that;

};

syncio.SockJS.api = require('sockjs');
syncio.SockJS.name_connector = 'SockJS';

syncio.SockJS.send = function( data ) {
    this.write( data );
};



/*

Url-Server: /syncio
Url-Client: /syncio

Url-Server: /syncio
Url-Client: http://localhost:9999/syncio

*/


