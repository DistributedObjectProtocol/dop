dop.core.emitReconnect = function(node, oldSocket, newNode) {
    if (node.listener) {
        dop.core.unregisterNode(newNode)
        node.listener.emit('reconnect', node, oldSocket)
    }
    node.emit('reconnect', oldSocket)
    dop.core.sendMessages(node)
}
