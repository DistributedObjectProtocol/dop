dop.core.transport = function Transport(socket) {
    dop.util.merge(this, new dop.util.emitter()) // Inherit emitter
    this.socket = socket
}

dop.core.transport.prototype.onCreate = function(
    socket,
    sendSocket,
    disconnectSocket
) {
    var node = new dop.core.node(this)
    node.socket = socket
    node.sendSocket = sendSocket
    node.disconnectSocket = disconnectSocket
    dop.core.registerNode(node)
    return node
}

dop.core.transport.prototype.onConnect = function(node) {
    node.status = dop.cons.NODE_STATUS_CONNECTED
    this.emit(dop.cons.ON_CONNECT, node)
}

dop.core.transport.prototype.onMessage = function(node, message) {
    dop.core.onMessage(node, message)
    this.emit(dop.cons.ON_MESSAGE, node, message)
}

dop.core.transport.prototype.onDisconnect = function(node) {
    node.status = dop.cons.NODE_STATUS_DISCONNECTED
    dop.core.unregisterNode(node)
    this.emit(dop.cons.ON_DISCONNECT, node)
}

dop.core.transport.prototype.onError = function(node) {
    this.emit(dop.cons.ON_ERROR, node)
}
