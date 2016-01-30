

syncio.socketio = function( url, options, on ) {

    var socket = io( url );

    socket.on('connect', function () {
        on.open();
    });

    socket.on('message', function ( message ) {
        on.message( message );
    });

    socket.on('disconnect', function () {
        on.close();
    });

    socket.on('error', function ( error ) {
        on.error( error );
    });

    return socket;

};

syncio.socketio.name_connector = 'socketio';

if ( typeof io == 'function' )
    syncio.socketio.api = io;