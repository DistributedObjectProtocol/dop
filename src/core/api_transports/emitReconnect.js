
dop.core.emitReconnect = function(oldNode, newNode) {
    var oldSocket = oldNode.socket;
    oldNode.socket = newNode.socket;
    oldNode.socket[CONS.socket_token] = oldNode.token;
    oldNode.listener.emit('reconnect', oldSocket);
    oldNode.emit('reconnect', oldSocket);
    dop.core.unregisterNode(newNode);
};