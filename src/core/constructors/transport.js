dop.core.transport = function Transport(socket, close) {
    dop.util.merge(this, new dop.util.emitter()) // Inherit emitter
    this.socket = socket
    this.close = close
    this.nodesByToken = dop.data.node
}

dop.core.transport.prototype.onCreate = function(
    socket,
    sendSocket,
    closeSocket,
    reconnectSocket
) {
    var node = new dop.core.node(this)
    this.updateSocket(node, socket, sendSocket, closeSocket, reconnectSocket)
    return node
}

dop.core.transport.prototype.onOpen = function(node, node_closed) {
    // NEW CONNECT
    if (node_closed === undefined) {
        node.sendSocket(node.token_local)
    }
    // // RECONNECT
    // else {
    //     this.updateSocket(
    //         node_closed,
    //         node.socket,
    //         node.sendSocket,
    //         node.closeSocket,
    //         node.reconnectSocket
    //     )
    //     node.sendSocket(node.token)
    // }
}

dop.core.transport.prototype.onMessage = function(node, message) {
    // console.log((dop.env === 'CLIENT') + 0, dop.env, node.status, message)
    // We use this functions to separate the logic a bit and make it cleaner
    if (node.status === dop.cons.NODE_STATE_OPEN)
        this.onMessageOPEN(node, message)
    else if (node.status === dop.cons.NODE_STATE_PRECONNECTED)
        this.onMessagePRECONNECTED(node, message)
    else if (node.status === dop.cons.NODE_STATE_CONNECTED)
        this.onMessageCONNECTED(node, message)
}

dop.core.transport.prototype.onMessageOPEN = function(node, message) {
    node.status = dop.cons.NODE_STATE_PRECONNECTED // waiting for the node confirmation
    node.token_remote = message // saving token remote
    node.sendSocket(node.token_local) // sending token_local again to confirm connection
}

dop.core.transport.prototype.onMessagePRECONNECTED = function(node, message) {
    if (node.token_remote === message) {
        this.confirmConnection(node)
    }
}

dop.core.transport.prototype.onMessageCONNECTED = function(node, message) {
    // DISCONNECT
    if (node.token === message) {
        this.disconnectAndDelete(node)
    }
    // EMIT and MANAGE MESSAGE VIA dop
    else {
        // Not sure if we should emit this
        node.emit(dop.cons.EVENT_MESSAGE, message)
        dop.core.onMessage(node, message)
    }
}

dop.core.transport.prototype.onClose = function(node) {
    if (node.status === dop.cons.NODE_STATE_CONNECTED) {
        node.status = dop.cons.NODE_STATE_RECONNECTING
        node.emit(dop.cons.EVENT_RECONNECTING)
        this.emit(dop.cons.EVENT_RECONNECTING, node)
    } else if (node.status !== dop.cons.NODE_STATE_DISCONNECTED) {
        node.status = dop.cons.NODE_STATE_DISCONNECTED
        node.emit(dop.cons.EVENT_DISCONNECT)
        this.emit(dop.cons.EVENT_DISCONNECT, node)
    }
}

dop.core.transport.prototype.onDisconnect = function(node) {
    // Sending token as instruccion to disconnect on the other side
    if (node.status === dop.cons.NODE_STATE_CONNECTED) {
        node.sendSocket(node.token)
    }
    this.disconnectAndDelete(node)
}

dop.core.transport.prototype.disconnectAndDelete = function(node) {
    node.closeSocket()
    dop.core.unregisterNode(node)
    node.status = dop.cons.NODE_STATE_DISCONNECTED
    node.emit(dop.cons.EVENT_DISCONNECT)
    this.emit(dop.cons.EVENT_DISCONNECT, node)
}

dop.core.transport.prototype.confirmConnection = function(node) {
    node.status = dop.cons.NODE_STATE_CONNECTED
    node.token = dop.util.getUniqueToken(node.token_local, node.token_remote)
    this.nodesByToken[node.token] = node
    delete node.token_local
    delete node.token_remote
    this.sendQueue(node)
    this.emit(dop.cons.EVENT_CONNECT, node)
}

dop.core.transport.prototype.sendQueue = function(node) {
    while (node.sends_queue.length > 0)
        node.sendSocket(node.sends_queue.shift())
}

dop.core.transport.prototype.updateSocket = function(
    node,
    socket,
    sendSocket,
    closeSocket,
    reconnectSocket
) {
    node.socket = socket
    node.sendSocket = sendSocket
    node.closeSocket = closeSocket
    node.reconnectSocket = reconnectSocket
}
