dop.core.transport = function Transport(server, type) {
    // Inherit emitter
    dop.util.merge(this, new dop.util.emitter())
    this.type = type
    this.nodes = []
    this.server = server // this is the instance created by the transport example: server = new WebSocket(...)
}

dop.core.transport.prototype.onOpen = function(socket, send) {
    console.log(this.type, 'onOpen')
    var node = new dop.core.node()
    node.transport = this
    node.socket = socket
    node.sendRaw = send
    dop.core.registerNode(node)
    // transport_node.emit('open', socket)
    // var client = {
    //     socket: socket,
    //     node: node,
    //     readyState: OPEN,
    //     queue: [],
    //     onReconnect: function(newSocket) {
    //         socket = newSocket
    //         this.socket = newSocket
    //         this.readyState = CONNECT
    //         clearTimeout(this.timeoutReconnection)
    //         delete this.timeoutReconnection
    //         dop.core.setSocketToNode(this.node, newSocket)
    //         sendQueue()
    //     }
    // }
}

dop.core.transport.prototype.send = function(socket, message) {
    socket.send(message)
}

dop.core.transport.prototype.onMessage = function(socket, message) {
    console.log(this.type, 'onMessage:', message)
}

dop.core.transport.prototype.onClose = function(socket) {
    console.log(this.type, 'onClose')
}

dop.core.transport.prototype.onError = function(socket) {}
