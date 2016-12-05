
dop.core.onOpenServer = function(listener, socket, transport) {
    listener.emit('open', socket);
    var node = new dop.core.node();
    node.readyState = dop.CONS.OPEN;
    node.transport = transport;
    node.socket = socket;
    node.try_connects = listener.options.try_connects;
    node.listener = listener;
    while (node.send_queue.length>0)
        node.send(node.send_queue.shift());
    dop.core.registerNode(node);
    dop.protocol.connect(node);
    return node;
};


