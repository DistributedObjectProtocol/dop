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
    
    // Helpers
    function send(message) {
        (socket.readyState===socket.constructor.OPEN && node.readyState===dop.CONS.CONNECT) ?
            socket.send(message)
        :
            send_queue.push(message); 
    }
    function sendQueue(message) {
        while (send_queue.length>0)
            socket.send(send_queue.shift());
    }

    // Socket events
    function onopen() {
        // Reconnect
        if (node.readyState === dop.CONS.RECONNECT)
            socket.send(node.tokenServer);
        // Connect
        else {
            socket.send(''); // Empty means we want to get connected
            node.readyState = dop.CONS.OPEN;
        }
        dop.core.emitOpen(node, socket, options.transport);
    }
    function onmessage(message) {
        // Reconnecting
        if (node.readyState===dop.CONS.RECONNECT && message.data===node.tokenServer) {
            node.readyState = dop.CONS.CONNECT;
            dop.core.setSocketToNode(node, socket);
            dop.core.emitReconnect(node, oldSocket);
        }
        else
            dop.core.emitMessage(node, message.data, message);
    }
    function onclose() {
        dop.core.emitClose(node, socket);
    }

    // dop events
    function onconnect() {
        if (node.readyState === dop.CONS.RECONNECT) {
            dop.core.emitDisconnect(node);
            dop.core.setSocketToNode(node, socket);
        }
        node.readyState = dop.CONS.CONNECT;
        dop.core.emitConnect(node);
    }
    function ondisconnect() {
        node.readyState = dop.CONS.CLOSE;
        socket.close();
    }

    function reconnect() {
        oldSocket = socket;
        socket = new api(url);
        node.readyState = dop.CONS.RECONNECT;
        addListeners(socket, onopen, onmessage, onclose);
        removeListeners(oldSocket, onopen, onmessage, onclose);
    }

    // Setting up
    dop.core.setSocketToNode(node, socket);
    node.readyState = dop.CONS.CLOSE;
    node.reconnect = reconnect;
    node.on(dop.CONS.CONNECT, onconnect);
    node.on(dop.CONS.SEND, send);
    node.on(dop.CONS.DISCONNECT, ondisconnect);
    addListeners(socket, onopen, onmessage, onclose);
    
    return socket;
}

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