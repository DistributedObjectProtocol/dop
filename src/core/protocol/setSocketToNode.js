
dop.core.setSocketToNode = function(node, socket) {
    node.socket = socket;
    socket[CONS.socket_token] = node.token;
};