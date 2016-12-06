
dop.core.emitReconnect = function(node, newNode) {
    var oldSocket = node.socket;
    node.socket = newNode.socket;
    node.socket[CONS.socket_token] = node.token;
    node.listener.emit('reconnect', node, oldSocket);
    node.emit('reconnect', oldSocket);
    dop.core.unregisterNode(newNode);
};

dop.core.emitReconnectClient = function(node, newSocket) {
    var oldSocket = node.socket;
    node.socket = newSocket;
    node.socket[CONS.socket_token] = node.token;
    node.emit('reconnect', oldSocket);
};