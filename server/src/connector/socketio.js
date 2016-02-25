
// http://socket.io/docs/server-api/
dop.socketio = function ( options, on ) {

    options.connector = options._connector; // Need it because socketio accept the option connector as parameter natively

    var socket_server = new dop.socketio.api( options.httpServer, options );

    if (typeof options.httpServer == 'undefined') {

        if (typeof options.port != 'number')
            options.port = dop.port;

        socket_server.listen( options.port );

    }

    socket_server.of( options.namespace ).on('connection', function( user ){

        user.emit('open');

        user.on('message', function(message){
            on.message( user, message );
        });

        user.on('disconnect', function(){
            on.close( user );
        });

        user.send = dop.socketio.send;

        user.close = dop.socketio.close;

        on.open( user );

    });


    return socket_server;

};

dop.socketio.api = require('socket.io');
dop.socketio.name_connector = 'socketio';

dop.socketio.send = function( data ) {
    this.emit('message', data);
};
dop.socketio.close = function( ) {
    this.disconnect();
};



/*

Url-Server: /dop
Url-Client: http://localhost:9999/dop

*/



