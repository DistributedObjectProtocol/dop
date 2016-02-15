

synko.socketio = function( options, on ) {

    var socket = synko.socketio.api( options.url );

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

synko.socketio.name_connector = 'socketio';
synko.socketio.api = window.io;