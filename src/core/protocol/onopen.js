
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
        while (node.send_queue.length>0)
            node.send(node.send_queue.shift());
        dop.protocol.connect(node);
    }
};


