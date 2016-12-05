
dop.core.onDisconnectClient = function(node, socket) {
    node.emit('disconnect');
    dop.core.unregisterNode(node);
};