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

    // Variables
    var api = options.transport.getApi(),
        socket = new api(url),
        send_queue = [];
    

    // We use this function as alias to store messages when connection is not CONNECT
    function send(message) {
        (socket.readyState===socket.constructor.OPEN && node.readyState===dop.CONS.CONNECT) ?
            socket.send(message)
        :
            send_queue.push(message); 
    }

    // This function emit all the queue messages
    function sendQueue(message) {
        while (send_queue.length>0)
            socket.send(send_queue.shift());
    }

    function onopen() {
        // Reconnect
        if (node.readyState === dop.CONS.RECONNECT) {
            socket.send(node.tokenServer);
        }
        // Connect
        else {
            socket.send(''); // Empty means we want to get connected
            node.readyState = dop.CONS.OPEN;
        }
        dop.core.emitOpen(node, socket, options.transport);
    }
    function onmessage(message) {
        // Reconnecting
        if (message.data===node.tokenServer && node.readyState===dop.CONS.RECONNECT) {
            node.readyState = dop.CONS.CONNECT;
            dop.core.emitReconnectClient(node, oldSocket);
            // sendQueue();
        }
        else
            dop.core.emitMessage(node, socket, message.data, message);
    }
    function onclose() {
        dop.core.emitClose(node, socket);
    }

    // Adding listeners
    addListeners(socket, onopen, onmessage, onclose);

    node.readyState = dop.CONS.CLOSE;
    node.reconnect = function() {
        oldSocket = socket;
        node.socket = socket = new api(url);
        addListeners(socket, onopen, onmessage, onclose);
        removeListeners(oldSocket, onopen, onmessage, onclose);
        node.readyState = dop.CONS.RECONNECT;
    };
    node.on(dop.CONS.CONNECT, function() {
        node.readyState = dop.CONS.CONNECT;
        dop.core.emitConnect(node);
    });
    node.on(dop.CONS.SEND, function(message) {
        send(message);
    });
    node.on(dop.CONS.DISCONNECT, function() {
        node.readyState = dop.CONS.CLOSE;
        socket.close();
    });

    

    return socket;
};

function addListeners(socket, onopen, onmessage, onclose) {
    socket.addEventListener('open', onopen);
    socket.addEventListener('message', onmessage);
    socket.addEventListener('close', onclose);
}
function removeListeners(socket, onopen, onmessage, onclose) {
    socket.removeEventListener('open', onopen);
    socket.removeEventListener('message', onmessage);
    socket.removeEventListener('close', onclose);
}


// UMD
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