
// http://socket.io/docs/server-api/
synko.socketio = function ( options, on ) {

    options.connector = options._connector; // Need it because socketio accept the option connector as parameter natively

    var socket_server = new synko.socketio.api( options.httpServer, options );

    if (typeof options.httpServer == 'undefined') {

        if (typeof options.port != 'number')
            options.port = synko.port;

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

        user.send = synko.socketio.send;

        user.close = synko.socketio.close;

        on.open( user );

    });


    return socket_server;

};

synko.socketio.api = require('socket.io');
synko.socketio.name_connector = 'socketio';

synko.socketio.send = function( data ) {
    this.emit('message', data);
};
synko.socketio.close = function( ) {
    this.disconnect();
};



/*

Url-Server: /synko
Url-Client: http://localhost:9999/synko

*/



