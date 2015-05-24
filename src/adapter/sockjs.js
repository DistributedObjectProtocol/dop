

var sockjs = require('sockjs');

syncio.SockJS = function ( options, on ) {

    if (typeof options.http_server == 'undefined')
        throw Error('The adapter SockJS needs the parameter http_server passed in the options');

    options.prefix = options.url;

    var $this = sockjs.createServer( options );

    $this.on('connection', function(user) {

        on.open( user );

        user.on('data', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

    });

    $this.installHandlers( options.http_server, options );

    return $this;

};



/*

Url-Server: /syncio
Url-Client: /syncio

Url-Server: /syncio
Url-Client: http://localhost:9999/syncio

*/


