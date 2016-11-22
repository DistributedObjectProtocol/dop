
var dopTransportConnectWebSocket = function(dop, node, options) {

    var url = 'ws://localhost:4444/';

    if (typeof options.url == 'string')
        url = options.url.replace('http','ws');
    else if (/http/.test(window.location.href)) {
        var domain_prefix = /(ss|ps)?:\/\/([^\/]+)\/?(.+)?/.exec(window.location.href);
        var protocol = domain_prefix[1] ? 'wss' : 'ws';
        url = protocol+'://'+domain_prefix[2].toLocaleLowerCase()+'/';
    }

    var socket = new options.transport.api(url);

    socket.addEventListener('open', function() {
        dop.core.onopen(node, socket);
    });

    socket.addEventListener('message', function(message) {
        dop.core.onmessage(node, socket, message.data, message);
    });

    socket.addEventListener('close', function() {
        dop.core.onclose(node, socket);
    });

    // socket.addEventListener('error', function(error) {
    //     dop.on.error(node, error);
    // });

    return socket;
};

dopTransportConnectWebSocket.api = window.WebSocket;

if (typeof dop == 'undefined' && typeof module == 'object' && module.exports)
    module.exports = dopTransportConnectWebSocket;
