

syncio.ws = function ( options, on ) {


    if (typeof options.http_server != 'undefined')
        options.server = options.http_server;

    else if (typeof options.port != 'number')
        options.port = syncio.port;


    var $this = new syncio.ws.api.Server( options );

    $this.on('connection', function( user ){


        user.on('message', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        user.$send = syncio.ws.$send;

        on.open( user );

    });


    return $this;

};

syncio.ws.api = require('ws');
syncio.ws.name_adapter = 'ws';

syncio.ws.$send = function( data ) {
    this.send( data );
};



/*

Url-Server: prefix cant be setted
Url-Client: ws://localhost:4444

*/



