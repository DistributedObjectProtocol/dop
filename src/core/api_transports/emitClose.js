
dop.core.emitClose = function(node, socket) {
    if (node.listener)
        node.listener.emit('close', socket);
    node.emit('close', socket);
};