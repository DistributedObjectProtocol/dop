dop.core.emitReconnect = function(node, old_socket, new_node) {
    if (node.listener) {
        dop.core.unregisterNode(new_node)
        node.listener.emit('reconnect', node, old_socket)
    }
    node.emit('reconnect', old_socket)
    dop.core.sendMessages(node)
}
