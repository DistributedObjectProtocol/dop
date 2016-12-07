
dop.core.emitOpen = function(listener_node, socket, transport) {
    var node;
    // Client
    if (listener_node instanceof dop.core.node)
        node = listener_node;
    // Server
    else {
        node = new dop.core.node();
        node.listener = listener_node;
        node.try_connects = listener_node.options.try_connects;
    }
    node.socket = socket;
    node.transport = transport;
    dop.core.registerNode(node);
    listener_node.emit('open', socket);
    return node;
};