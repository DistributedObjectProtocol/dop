
dop.core.onReconnectServer = function(listener, oldNode, newNode) {
    var oldSocket = oldNode.socket;
    var newSocket = newNode.socket;
    oldNode.socket = newSocket;
    oldNode.socket[CONS.socket_token] = oldNode.token;
    listener.emit('reconnect', newNode, oldSocket, newSocket);
    oldNode.emit('reconnect', oldSocket, newSocket);
    dop.core.unregisterNode(newNode);
};