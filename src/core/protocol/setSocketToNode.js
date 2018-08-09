dop.core.setSocketToNode = function(node, socket) {
    node.socket = socket
    socket[dop.cons.TOKEN] = node.token
}
