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


    var api = options.transport.getApi(),
        socket = new api(url),
        oldSocket,
        send_queue = [];
    

    // We use this function as alias to store sends when connection is not OPEN
    function send(message) {
        (socket.readyState === socket.constructor.OPEN) ? 
            socket.send(message)
        : 
            send_queue.push(message);
    }

    // node.readyState = dop.CONS.CLOSE;
    // node.reconnect = function() {
    //     oldSocket = node.socket;
    //     node.socket = node.options.transport.apply(node, args);
    //     node.readyState = dop.CONS.RECONNECT;
    //     send(node.tokenServer);
    // };
    node.on(dop.CONS.SEND, function(message) {
        send(message);
    });
    // node.on('close', function() {
    //     node.readyState = dop.CONS.CLOSE;
    //     socket.close();
    // });



    socket.addEventListener('open', function() {
        node.readyState = dop.CONS.OPEN;
        send(); // Empty means we want to get connected, the token means reconnect
        dop.core.onOpenClient(node, socket, options.transport);
    });
    socket.addEventListener('message', function(message) {
        dop.core.emitMessage(node, message.data, message);
    });
    socket.addEventListener('close', function() {
        dop.core.onCloseClient(node, socket);
        // If node.readyState === dop.CONS.CLOSE means node.disconnect() has been called and we DON'T try to reconnect
        if (node.readyState === dop.CONS.CLOSE)
            dop.core.onDisconnectClient(node, socket);
    });


    return socket;
};

if (typeof dop=='undefined' && typeof module == 'object' && module.exports)
    module.exports = websocket;
else {
    websocket.getApi = function() { return window.WebSocket };
    (typeof dop != 'undefined') ?
        dop.transports.connect.websocket = websocket
    :
        root.dopTransportsConnectWebsocket = websocket;
}

})(this);