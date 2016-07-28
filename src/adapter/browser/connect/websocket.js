
dop.adapter.browser.connect.WebSocket = function( node, options ) {

    var domain_prefix = /(ss|ps)?:\/\/([^\/]+)\/?(.+)?/.exec( options.url || window.location.href );
    var protocol = domain_prefix[1] ? 'wss' : 'ws';
    var socket = new WebSocket(protocol+'://'+domain_prefix[2].toLocaleLowerCase()+'/', domain_prefix[3] || dop.name);

    socket.addEventListener('open', function() {
        dop.core.onopen( node, socket );
    });

    socket.addEventListener('message', function( message ) {
        dop.core.onmessage( node, socket, message.data, message );
    });

    socket.addEventListener('close', function() {
        dop.core.onclose( node, socket );
    });

    // socket.addEventListener('error', function( error ) {
    //     dop.on.error( node, error );
    // });

    return socket;

};

dop.adapter.browser.connect.WebSocket._name = 'WebSocket';
dop.adapter.browser.connect.WebSocket.api = WebSocket;
