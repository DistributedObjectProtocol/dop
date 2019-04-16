dop.core.transport = function Transport() {
    // Inherit emitter
    dop.util.merge(this, new dop.util.emitter())
    this.nodesBySocket = dop.util.map()
    this.nodesByToken = dop.data.node
    this.nodesByRemoteToken = {}
}

dop.core.transport.prototype.onOpen = function(socket, sendRaw) {
    var node = new dop.core.node(this)
    this.updateSocket(node, socket, sendRaw)
    sendRaw(node.token)
}

dop.core.transport.prototype.onMessage = function(socket, message) {
    var remote_token = message
    var old_node = this.nodesByRemoteToken[remote_token]
    var node = this.nodesBySocket.get(socket)
    if (node.status === dop.cons.NODE_STATE_OPEN) {
        // CONNECT
        if (old_node === undefined) {
            node.status = dop.cons.NODE_STATE_CONNECTED
            this.nodesByToken[node.token] = node // dop.core.registerNode(node)
            this.nodesByRemoteToken[remote_token] = node
            this.emit(dop.cons.EVENT_CONNECT, node)
        }
        // RECONNECT
        else if (old_node.status === dop.cons.NODE_STATE_RECONNECTING) {
            // Removing the closed socket
            var old_socket = old_node.socket
            this.nodesBySocket.delete(old_socket)
            // Updating the new socket to the old node
            this.updateSocket(old_node, socket, node.sendRaw)
            // Emitting
            old_node.status = dop.cons.NODE_STATE_CONNECTED
            old_node.emit(dop.cons.EVENT_RECONNECT)
            this.emit(dop.cons.EVENT_RECONNECT, old_node)
        } else {
            // At some point we need to manage this
            // This could happen if another node is trying to
            // connect with a token that is already used by another node.
        }
    }
    // console.log(this.type, 'onMessage:', message, node.status)
}

dop.core.transport.prototype.onClose = function(socket) {
    var node = this.nodesBySocket.get(socket)
    node.status = dop.cons.NODE_STATE_RECONNECTING
}

dop.core.transport.prototype.onReconnect = function(
    old_socket,
    socket,
    sendRaw
) {
    // Getting original node
    var node = this.nodesBySocket.get(old_socket)
    dop.util.invariant(
        node.status === dop.cons.NODE_STATE_RECONNECTING,
        'You are trying to reconnect a socket/node that is not closed'
    )
    // Removing the closed socket
    this.nodesBySocket.delete(old_socket)
    // Updating the new socket to the node
    this.updateSocket(node, socket, sendRaw)
    // Sending instruccion to reconnect
    node.sendRaw(node.token)
    // Emit event
    node.status = dop.cons.NODE_STATE_CONNECTED
    node.emit(dop.cons.EVENT_RECONNECT)
    this.emit(dop.cons.EVENT_RECONNECT, node)
}

dop.core.transport.prototype.onDisconnect = function(node) {
    // Sending token as instruccion to disconnect
    node.sendRaw(node.token)
    // Emitting
    node.status = dop.cons.NODE_STATE_DISCONNECTED
    node.emit(dop.cons.EVENT_DISCONNECT)
    this.emit(dop.cons.EVENT_DISCONNECT, node)
}

dop.core.transport.prototype.updateSocket = function(node, socket, sendRaw) {
    node.socket = socket
    node.sendRaw = sendRaw
    this.nodesBySocket.set(socket, node)
}
