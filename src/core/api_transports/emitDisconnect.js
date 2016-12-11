
dop.core.emitDisconnect = function(node) {
    if (node.listener) {
        dop.core.unregisterNode(node);
        node.listener.emit('disconnect', node);
    }
    node.emit('disconnect');
};