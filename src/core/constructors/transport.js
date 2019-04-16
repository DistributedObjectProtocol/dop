dop.core.transport = function Transport() {
    // Inherit emitter
    dop.util.merge(this, new dop.util.emitter())
    this.nodesBySocket = dop.util.map()
    this.nodesByToken = dop.data.node
}

dop.core.transport.prototype.onOpen = function(
    socket,
    sendSocket,
    closeSocket
) {
    var node = new dop.core.node(this)
    this.updateSocket(node, socket, sendSocket, closeSocket)
    sendSocket(node.token)
}

dop.core.transport.prototype.onMessage = function(socket, message_token) {
    var node = this.nodesBySocket.get(socket)
    if (node.status === dop.cons.NODE_STATE_OPEN) {
        var old_node = this.nodesByToken[message_token]
        // CONNECT
        if (old_node === undefined) {
            node.status = dop.cons.NODE_STATE_CONNECTED
            node.token = this.getUniqueToken(node.token, message_token)
            this.nodesByToken[node.token] = node
            this.emit(dop.cons.EVENT_CONNECT, node)
        }
        // RECONNECT
        else if (old_node.status === dop.cons.NODE_STATE_RECONNECTING) {
            // Removing the closed socket
            var old_socket = old_node.socket
            this.nodesBySocket.delete(old_socket)
            // Updating the new socket to the old node
            this.updateSocket(
                old_node,
                socket,
                node.sendSocket,
                node.closeSocket
            )
            // Emitting
            old_node.status = dop.cons.NODE_STATE_CONNECTED
            old_node.emit(dop.cons.EVENT_RECONNECT)
            this.emit(dop.cons.EVENT_RECONNECT, old_node)
        } else {
            // This could happen if another node is trying to
            // connect with a token that is already used by another node.
            // So we must force the disconnection of the socket/node.
            console.log('WE MUST GO HERE!')
        }
    }
    // DISCONNECT
    else if (
        node.status === dop.cons.NODE_STATE_CONNECTED &&
        node.token === message_token
    ) {
        this.onDisconnect(node)
    }
}

dop.core.transport.prototype.onClose = function(socket) {
    var node = this.nodesBySocket.get(socket)
    // If node is undefined is because we already removed the linked socket in onDisconnect()
    if (node !== undefined && node.status === dop.cons.NODE_STATE_CONNECTED)
        node.status = dop.cons.NODE_STATE_RECONNECTING
}

dop.core.transport.prototype.onReconnect = function(
    old_socket,
    socket,
    sendSocket,
    closeSocket
) {
    // Getting original node
    var node = this.nodesBySocket.get(old_socket)
    dop.util.invariant(
        node.status === dop.cons.NODE_STATE_RECONNECTING,
        'You are trying to reconnect a socket/node that is not reconnecting'
    )
    // Removing the closed socket
    this.nodesBySocket.delete(old_socket)
    // Updating the new socket to the node
    this.updateSocket(node, socket, sendSocket, closeSocket)
    // Sending instruccion to reconnect
    node.sendSocket(node.token)
    // Emit event
    node.status = dop.cons.NODE_STATE_CONNECTED
    node.emit(dop.cons.EVENT_RECONNECT)
    this.emit(dop.cons.EVENT_RECONNECT, node)
}

dop.core.transport.prototype.forceDisconnect = function(node) {
    if (node.status === dop.cons.NODE_STATE_CONNECTED) {
        // Sending token as instruccion to disconnect
        node.sendSocket(node.token)
        this.onDisconnect(node)
    }
}

dop.core.transport.prototype.onDisconnect = function(node) {
    node.status = dop.cons.NODE_STATE_DISCONNECTED
    // Closing socket
    node.closeSocket()
    // Emitting
    node.emit(dop.cons.EVENT_DISCONNECT)
    this.emit(dop.cons.EVENT_DISCONNECT, node)
    // Removing everything
    this.nodesBySocket.delete(node.socket)
    dop.core.unregisterNode(node)
}

dop.core.transport.prototype.updateSocket = function(
    node,
    socket,
    sendSocket,
    closeSocket
) {
    node.socket = socket
    node.sendSocket = sendSocket
    node.closeSocket = closeSocket
    this.nodesBySocket.set(socket, node)
}

dop.core.transport.prototype.getUniqueToken = function(token1, token2) {
    return token1 < token2 ? token1 + token2 : token2 + token1
}
