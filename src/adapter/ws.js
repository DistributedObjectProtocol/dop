

var ws = require('ws');

syncio.ws = function ( options, on ) {


    if (typeof options.http_server != 'undefined')
        options.server = options.http_server;

    else if (typeof options.port != 'number')
        options.port = syncio.port;


    var $this = new ws.Server( options );

    $this.on('connection', function( user ){

        on.open( user );

        user.on('message', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });


    });


    return $this;

};


/*

Url-Server: prefix cant be setted
Url-Client: ws://localhost:4444

*/



