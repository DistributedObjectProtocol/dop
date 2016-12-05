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
        oldSocket,
        send_queue = [],
        send = socket.send,
        close = socket.close;
    
    node.readyState = dop.CONS.CLOSE;
    node.once('connect', function() {
        node.readyState = dop.CONS.CONNECT;
    });

    node.reconnect = function() {
        oldSocket = node.socket;
        node.socket = node.options.transport.apply(node, args);
        node.readyState = dop.CONS.RECONNECT;
        socket.send(node.tokenServer);
    };

    socket.send = function(message) {
        if (socket.readyState === api.OPEN)
            return send.call(socket, message);
        else
            send_queue.push(message);
    };

    socket.close = function() {
        node.readyState = dop.CONS.CLOSE;
        return close.call(socket);
    };

    socket.addEventListener('open', function() {
        node.readyState = dop.CONS.OPEN;
        while (send_queue.length>0)
            send.call(socket, send_queue.shift());
        dop.core.onOpenClient(node, socket);
    });

    socket.addEventListener('message', function(message) {
        if (message.data === node.token) {
            console.log( 'RECONNECTING?' );
        }
        dop.core.onMessageClient(node, socket, message.data, message);
    });

    socket.addEventListener('close', function() {
        dop.core.onCloseClient(node, socket);
        // If node.readyState === dop.CONS.CLOSE means node.disconnect() has been called and we DON'T try to reconnect
        if (node.readyState === dop.CONS.CLOSE)
            dop.core.onDisconnectClient(node, socket);
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