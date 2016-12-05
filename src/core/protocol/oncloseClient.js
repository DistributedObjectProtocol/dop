
dop.core.onCloseClient = function(node, socket) {
    node.readyState = dop.CONS.CLOSE;
    node.emit('close', socket);
    node.emit('disconnect');
    dop.core.unregisterNode(node);
};