
dop.core.emitDisconnect = function(node) {
    if (node.listener)
        node.listener.emit('disconnect', node);
    node.emit('disconnect');
    dop.core.unregisterNode(node);
};