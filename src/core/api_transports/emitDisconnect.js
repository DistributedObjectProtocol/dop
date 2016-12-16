
dop.core.emitDisconnect = function(node) {
    node.connected = false;
    if (node.listener) {
        dop.core.unregisterNode(node);
        node.listener.emit('disconnect', node);
    }
    node.emit('disconnect');
};