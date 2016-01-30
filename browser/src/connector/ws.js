

syncio.ws = function( url, options, on ) {

    var domain_prefix = /(s?):\/\/([^\/]+)\/(.+)/.exec( url );
    var socket = new WebSocket('ws'+domain_prefix[1].toLocaleLowerCase()+'://'+domain_prefix[2].toLocaleLowerCase()+'/', domain_prefix[3]);

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

syncio.ws.name_connector = 'ws';

if ( typeof WebSocket == 'function' )
    syncio.ws.api = WebSocket;