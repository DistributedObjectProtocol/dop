(function(root){
function websocket(dop, node, options) {

    var url = 'ws://localhost:4444/'+dop.name,
        oldSocket;

    if (typeof options.url == 'string')
        url = options.url.replace('http','ws');
    else if (typeof window!='undefined' && typeof window.location!='undefined' && /http/.test(window.location.href)) {
        var domain_prefix = /(ss|ps)?:\/\/([^\/]+)\/?(.+)?/.exec(window.location.href),
            protocol = domain_prefix[1] ? 'wss' : 'ws';
        url = protocol+'://'+domain_prefix[2].toLocaleLowerCase()+'/'+dop.name;
    }

    // Variables
    var api = options.transport.getApi(),
        socket = new api(url),
        tokenServer,
        send_queue = [],
        readyState;
    
    // Helpers
    function send(message) {
        (socket.readyState===OPEN) ?
            socket.send(message)
        :
            send_queue.push(message); 
    }
    function sendQueue() {
        if (socket.readyState===OPEN)
            while (send_queue.length>0)
                socket.send(send_queue.shift());
    }

    // Socket events
    function onopen() {
        // Reconnect
        if (readyState === CONNECTING)
            socket.send(tokenServer);
        // Connect
        else {
            socket.send(''); // Empty means we want to get connected
            readyState = OPEN;
        }
        dop.core.emitOpen(node, socket, options.transport);
    }
    function onmessage(message) {
        // console.log( 'C<<: `'+message.data+'`' );
        // Reconnecting
        if (readyState===CONNECTING && message.data===tokenServer) {
            readyState = CONNECT;
            dop.core.setSocketToNode(node, socket);
            dop.core.emitReconnect(node, oldSocket);
            sendQueue();
        }
        else if (readyState !== CONNECT) {
            tokenServer = message.data;
            readyState = CONNECT;
            dop.core.setSocketToNode(node, socket);
            send(tokenServer);
            sendQueue();
            dop.core.emitConnect(node);
        }
        else
            dop.core.emitMessage(node, message.data, message);
    }
    function onclose() {
        readyState = CLOSE;
        dop.core.emitClose(node, socket);
        dop.core.emitDisconnect(node);
    }

    // dop events
    // function onconnect() {
    //     if (readyState === CONNECTING) {
    //         dop.core.emitDisconnect(node);
    //         dop.core.setSocketToNode(node, socket);
    //     }
    //     readyState = CONNECT;
    //     dop.core.emitConnect(node);
    //     sendQueue();
    // }
    function ondisconnect() {
        readyState = CLOSE;
        socket.close();
    }

    function reconnect() {
        if (readyState === CLOSE) {
            oldSocket = socket;
            socket = new api(url);
            readyState = CONNECTING;
            addListeners(socket, onopen, onmessage, onclose);
            removeListeners(oldSocket, onopen, onmessage, onclose);
        }
    }

    // Setting up
    dop.core.setSocketToNode(node, socket);
    readyState = CLOSE;
    node.reconnect = reconnect;
    // node.on(dop.cons.CONNECT, onconnect);
    node.on(dop.cons.SEND, send);
    node.on(dop.cons.DISCONNECT, ondisconnect);
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
if (
    typeof module == 'object' &&
    module.exports &&
    !(typeof dop == 'object' && typeof factory == 'function' && dop.create === factory) // this is true if we are inside of dop.factory
)
    module.exports = websocket;
else {
    websocket.getApi = function() { return window.WebSocket };
    (typeof dop != 'undefined') ?
        dop.transports.connect.websocket = websocket
    :
        root.dopTransportsConnectWebsocket = websocket;
}

// Cons
var CLOSE = 0,
    OPEN = 1,
    CONNECTING = 2,
    CONNECT = 3;


})(this);