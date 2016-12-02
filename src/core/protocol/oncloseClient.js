
dop.core.oncloseClient = function(node, socket) {
    node.readyState = dop.CONS.CLOSE;
    node.emit('close', socket);
    node.emit('disconnect', node);
    dop.core.unregisterNode(node);
};