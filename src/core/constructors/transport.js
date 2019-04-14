dop.core.transport = function Transport() {
    // Inherit emitter
    dop.util.merge(this, new dop.util.emitter())
    this.nodesBySocket = dop.util.map()
    this.nodesByToken = dop.data.node // this is a hack, not sure about this
    this.nodesByRemoteToken = {}
}

dop.core.transport.prototype.onOpen = function(socket, sendRaw) {
    var node = new dop.core.node(this, socket, sendRaw)
    this.nodesBySocket.set(socket, node)
    this.nodesByToken[node.token] = node // dop.core.registerNode(node)
    sendRaw(node.token)
    console.log(this.type, 'onOpen')
}

dop.core.transport.prototype.onMessage = function(socket, message) {
    var node = this.nodesBySocket.get(socket)
    // CONNECTED
    if (node.status === dop.cons.NODE_STATE_OPEN) {
        node.status = dop.cons.NODE_STATE_CONNECTED
        this.nodesByRemoteToken[message] = node
        this.emit(dop.const.EVENT_CONNECT, node)
        node.emit(dop.const.EVENT_CONNECT)
    }
    console.log(this.type, 'onMessage:', message, node.status)
}

dop.core.transport.prototype.onClose = function(socket) {
    node.status = dop.cons.NODE_STATE_RECONNECTING
    console.log(this.type, 'onClose', node.status)
}

dop.core.transport.prototype.onReconnect = function(
    old_socket,
    socket,
    sendRaw
) {
    // var old_node = this.nodesBySocket.get(old_socket)
    // var node = this.nodesBySocket.get(socket)
    // var node = new dop.core.node(this, socket, sendRaw)
    // dop.core.registerNode(node)
    // sendRaw(node.token)
    console.log(this.type, 'onReconnect')
}
