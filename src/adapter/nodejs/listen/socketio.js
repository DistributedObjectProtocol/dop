// http://socket.io/docs/server-api/
dop.adapter.nodejs.listen.socketio = function ( options, on ) {

    options.connector = options._connector; // Need it because socketio accept the option connector as parameter natively

    var socket = new dop.adapter.nodejs.listen.socketio.api( options.httpServer, options );

    if (typeof options.httpServer == 'undefined') {

        if (typeof options.port != 'number')
            options.port = 4444;

        socket.listen( options.port );

    }

    socket.of( options.namespace ).on('connection', function( user ){

        user.emit('open');

        user.on('message', function(message){
            on.message( user, message );
        });

        user.on('disconnect', function(){
            on.close( user );
        });

        user.send = dop.adapter.nodejs.listen.socketio.send;

        user.close = dop.adapter.nodejs.listen.socketio.close;

        on.open( user );

    });


    return socket;

};
dop.adapter.nodejs.listen.socketio.api = require('socket.io');
dop.adapter.nodejs.listen.socketio._name = 'socketio';
dop.adapter.nodejs.listen.socketio.send = function( data ) {
    this.emit('message', data);
};
dop.adapter.nodejs.listen.socketio.close = function( ) {
    this.disconnect();
};



/*

Url-Server: /dop
Url-Client: http://localhost:9999/dop

*/



