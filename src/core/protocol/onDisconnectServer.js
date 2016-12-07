
dop.core.onDisconnectServer = function(listener, socket) {
    var node = dop.getNodeBySocket(socket);
    if (isObject(node)) {
        listener.emit('disconnect', node);
        node.emit('disconnect');
        dop.core.unregisterNode(node);
    }
};
