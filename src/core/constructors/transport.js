dop.core.transport = function Transport() {
    // Inherit emitter
    dop.util.merge(this, new dop.util.emitter())
    this.nodesBySocket = dop.util.map()
    this.nodesByToken = dop.data.node // this is a hack, not sure about this
    this.nodesByRemoteToken = {}
}

dop.core.transport.prototype.onOpen = function(socket, sendRaw) {
    var node = new dop.core.node(this)
    this.updateSocket(node, socket, sendRaw)
    sendRaw(node.token)
}

dop.core.transport.prototype.onMessage = function(socket, message) {
    var node = this.nodesBySocket.get(socket)
    if (node.status === dop.cons.NODE_STATE_OPEN) {
        var tokens = message.split(' ')
        var old_node = this.nodesByRemoteToken[tokens[0]]
        // CONNECT
        if (old_node === undefined) {
            node.status = dop.cons.NODE_STATE_CONNECTED
            this.nodesByToken[node.token] = node // dop.core.registerNode(node)
            this.nodesByRemoteToken[tokens[0]] = node
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
            this.emit(dop.cons.EVENT_RECONNECT, old_node)
            old_node.emit(dop.cons.EVENT_RECONNECT)
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
    // Emit event
    node.status = dop.cons.NODE_STATE_CONNECTED
    this.emit(dop.cons.EVENT_RECONNECT, node)
    node.emit(dop.cons.EVENT_RECONNECT)
    // Sending old token to reconnect
    sendRaw(node.token)
}

dop.core.transport.prototype.updateSocket = function(node, socket, sendRaw) {
    node.socket = socket
    node.sendRaw = sendRaw
    this.nodesBySocket.set(socket, node)
}
