

syncio.SockJS = function ( options, on ) {

    if (typeof options.http_server == 'undefined')
        throw Error('The adapter SockJS needs the parameter http_server passed in the options');

    options.prefix = options.url;

    var $this = syncio.SockJS.api.createServer( options );

    $this.on('connection', function(user) {

        user.on('data', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        user.$send = syncio.SockJS.$send;

        on.open( user );

    });

    $this.installHandlers( options.http_server, options );

    return $this;

};

syncio.SockJS.api = require('sockjs');
syncio.SockJS.name_adapter = 'SockJS';

syncio.SockJS.$send = function( data ) {
    this.write( data );
};



/*

Url-Server: /syncio
Url-Client: /syncio

Url-Server: /syncio
Url-Client: http://localhost:9999/syncio

*/


