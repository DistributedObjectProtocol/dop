

syncio.socketio = function ( options, on ) {

    var $this = new syncio.socketio.api( options.http_server, options );


    if (typeof options.http_server == 'undefined') {

        if (typeof options.port != 'number')
            options.port = syncio.port;

        $this.listen( options.port );

    }


    $this.of('/syncio').on('connection', function( user ){

        user.emit('open');

        user.on('message', function(message){
            on.message( user, message );
        });

        user.on('disconnect', function(){
            on.close( user );
        });

        user.$send = syncio.socketio.$send;

        on.open( user );

    });


    return $this;

};

syncio.socketio.api = require('socket.io');
syncio.socketio.name_adapter = 'socketio';

syncio.socketio.$send = function( data ) {
    this.emit('message', data);
};



/*

Url-Server: /syncio
Url-Client: http://localhost:9999/syncio

*/



