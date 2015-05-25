
// https://github.com/websockets/ws
syncio.ws = function ( options, on ) {

    var id = 1;

    if (typeof options.httpServer != 'undefined')
        options.server = options.httpServer;

    else if (typeof options.port != 'number')
        options.port = syncio.port;


    var $this = new syncio.ws.api.Server( options );

    $this.on('connection', function( user ){

        user.id = id++;

        user.on('message', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        on.open( user );

    });


    return $this;

};

syncio.ws.api = require('ws');
syncio.ws.name_adapter = 'ws';



/*

Url-Server: prefix cant be setted
Url-Client: ws://localhost:4444

*/



