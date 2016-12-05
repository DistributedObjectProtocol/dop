
dop.core.onOpenServer = function(listener, socket, transport) {
    listener.emit('open', socket);
    var node = new dop.core.node();
    node.transport = transport;
    node.socket = socket;
    node.try_connects = listener.options.try_connects;
    node.listener = listener;
    dop.core.registerNode(node);
    dop.protocol.connect(node);
    return node;
};


