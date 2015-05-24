

var socketio = require('socket.io');

syncio.socketio = function ( options, on ) {

    var $this = new socketio( options.http_server );


    if (typeof options.http_server == 'undefined') {

        if (typeof options.port != 'number')
            options.port = syncio.port;

        $this.listen( options.port );

    }


    $this.on('connection', function( user ){

        on.open( user );

        user.on('event', function(message){
            on.message( user, message );
        });

        user.on('disconnect', function(){
            on.close( user );
        });

    });


    return $this;

};


/*

Url-Server: /syncio
Url-Client: http://localhost:9999/syncio

Url-Server: http://localhost:9999/syncio
Url-Client: http://localhost:9999/syncio

*/



