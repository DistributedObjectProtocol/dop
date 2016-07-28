
dop.adapter.browser.connect.socketio = function( options, on ) {

    var socket = dop.adapter.browser.connect.socketio.api( options.url || window.location.href );

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
dop.adapter.browser.connect.socketio._name = 'socketio';
dop.adapter.browser.connect.socketio.api = window.io;