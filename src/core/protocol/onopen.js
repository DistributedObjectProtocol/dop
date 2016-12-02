
dop.core.onopen = function(listener_or_node, socket, transport) {

    listener_or_node.emit('open', socket);

    // if listener_or_node is listener we send token
    if (listener_or_node.socket !== socket) {
        var node = new dop.core.node();
        node.readyState = 1;
        node.transport = transport;
        node.socket = socket;
        node.try_connects = listener_or_node.options.try_connects;
        node.listener = listener_or_node;
        dop.core.registerNode(node);
        dop.protocol.connect(node);
        return node;
    }
};


