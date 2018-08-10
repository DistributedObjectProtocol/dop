;(function(root) {
    function websocket(dop, node, options) {
        var url = 'ws://localhost:4444/' + dop.name,
            old_socket

        if (typeof options.url == 'string')
            url = options.url.replace('http', 'ws')
        else if (
            typeof window != 'undefined' &&
            typeof window.location != 'undefined' &&
            /http/.test(window.location.href)
        ) {
            var domain_prefix = /(ss|ps)?:\/\/([^\/]+)\/?(.+)?/.exec(
                    window.location.href
                ),
                protocol = domain_prefix[1] ? 'wss' : 'ws'
            url =
                protocol +
                '://' +
                domain_prefix[2].toLocaleLowerCase() +
                '/' +
                dop.name
        }

        // Variables
        var api = options.transport.getApi(),
            socket = new api(url),
            token_server,
            send_queue = [],
            ready_state

        // Helpers
        function send(message) {
            socket.ready_state === OPEN
                ? socket.send(message)
                : send_queue.push(message)
        }
        function sendQueue() {
            if (socket.ready_state === OPEN)
                while (send_queue.length > 0) socket.send(send_queue.shift())
        }

        // Socket events
        function onopen() {
            // Reconnect
            if (ready_state === CONNECTING) socket.send(token_server)
            // Connect
            else {
                socket.send('') // Empty means we want to get connected
                ready_state = OPEN
            }
            dop.core.emitOpen(node, socket, options.transport)
        }
        function onmessage(message) {
            // console.log( 'C<<: `'+message.data+'`' );
            // Reconnecting
            if (ready_state === CONNECTING && message.data === token_server) {
                ready_state = CONNECT
                dop.core.setSocketToNode(node, socket)
                dop.core.emitReconnect(node, old_socket)
                sendQueue()
            } else if (ready_state !== CONNECT) {
                token_server = message.data
                ready_state = CONNECT
                dop.core.setSocketToNode(node, socket)
                send(token_server)
                sendQueue()
                dop.core.emitConnect(node)
            } else dop.core.emitMessage(node, message.data, message)
        }
        function onclose() {
            ready_state = CLOSE
            dop.core.emitClose(node, socket)
            dop.core.emitDisconnect(node)
        }

        // dop events
        // function onconnect() {
        //     if (ready_state === CONNECTING) {
        //         dop.core.emitDisconnect(node);
        //         dop.core.setSocketToNode(node, socket);
        //     }
        //     ready_state = CONNECT;
        //     dop.core.emitConnect(node);
        //     sendQueue();
        // }
        function ondisconnect() {
            ready_state = CLOSE
            socket.close()
        }

        function reconnect() {
            if (ready_state === CLOSE) {
                old_socket = socket
                socket = new api(url)
                ready_state = CONNECTING
                addListeners(socket, onopen, onmessage, onclose)
                removeListeners(old_socket, onopen, onmessage, onclose)
            }
        }

        // Setting up
        dop.core.setSocketToNode(node, socket)
        ready_state = CLOSE
        node.reconnect = reconnect
        // node.on(dop.cons.CONNECT, onconnect);
        node.on(dop.cons.SEND, send)
        node.on(dop.cons.DISCONNECT, ondisconnect)
        addListeners(socket, onopen, onmessage, onclose)

        return socket
    }

    function addListeners(socket, onopen, onmessage, onclose) {
        socket.addEventListener('open', onopen)
        socket.addEventListener('message', onmessage)
        socket.addEventListener('close', onclose)
    }
    function removeListeners(socket, onopen, onmessage, onclose) {
        socket.removeEventListener('open', onopen)
        socket.removeEventListener('message', onmessage)
        socket.removeEventListener('close', onclose)
    }

    // UMD
    if (
        typeof module == 'object' &&
        module.exports &&
        !(
            typeof dop == 'object' &&
            typeof factory == 'function' &&
            dop.create === factory
        ) // this is true if we are inside of dop.factory
    )
        module.exports = websocket
    else {
        websocket.getApi = function() {
            return window.WebSocket
        }
        typeof dop != 'undefined'
            ? (dop.transports.connect.websocket = websocket)
            : (root.dopTransportsConnectWebsocket = websocket)
    }

    // Cons
    var CLOSE = 0,
        OPEN = 1,
        CONNECTING = 2,
        CONNECT = 3
})(this)
