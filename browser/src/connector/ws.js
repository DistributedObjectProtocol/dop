

dop.ws = function( options, on ) {

    var protocol = ( options.ssl ) ? 'wss' : 'ws';
    var socket = new WebSocket(protocol+'://'+options.host+'/' + options.prefix);

    socket.addEventListener('open', function() {
        on.open();
    });

    socket.addEventListener('message', function( message ) {
        on.message( message.data );
    });

    socket.addEventListener('close', function() {
        on.close();
    });

    socket.addEventListener('error', function( error ) {
        on.error( error );
    });

    return socket;

};

dop.ws.name_connector = 'ws';
dop.ws.api = WebSocket;