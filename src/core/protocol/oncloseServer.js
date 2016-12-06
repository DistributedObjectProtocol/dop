
dop.core.onCloseServer = function(listener, socket) {
    listener.emit('close', socket);
    // var node = dop.getNodeBySocket(socket);
    // if (dop.util.isObject(node))
        // node.emit('close');
};
