(function(root){
function websocket(dop, node, options) {

    var url = 'ws://localhost:4444/'+dop.name,
        args = arguments;

    if (typeof options.url == 'string')
        url = options.url.replace('http','ws');
    else if (typeof window!='undefined' && /http/.test(window.location.href)) {
        var domain_prefix = /(ss|ps)?:\/\/([^\/]+)\/?(.+)?/.exec(window.location.href),
            protocol = domain_prefix[1] ? 'wss' : 'ws';
        url = protocol+'://'+domain_prefix[2].toLocaleLowerCase()+'/'+dop.name;
    }

    var api = options.transport.api(),
        socket = new api(url),
        send = socket.send;
    
    node.reconnect = function() {
        var oldSocket = node.socket;
        node.socket = node.options.transport.apply(node, args);
        node.send(node.tokenServer);
    };

    socket.send = function(message) {
        send.call(socket, message);
    };

    socket.addEventListener('open', function() {
        dop.core.onOpenClient(node, socket);
    });

    socket.addEventListener('message', function(message) {
        dop.core.onMessageClient(node, socket, message.data, message);
    });

    socket.addEventListener('close', function() {
        dop.core.onCloseClient(node, socket);
    });

    // socket.addEventListener('error', function(error) {
    //     dop.on.error(node, error);
    // });

    return socket;
};

if (typeof dop=='undefined' && typeof module == 'object' && module.exports)
    module.exports = websocket;
else {
    websocket.api = function() { return window.WebSocket };
    (typeof dop != 'undefined') ?
        dop.transports.connect.websocket = websocket
    :
        root.dopTransportsConnectWebsocket = websocket;
}

})(this);